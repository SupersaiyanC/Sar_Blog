import AVFoundation
import Combine

/// Runs the back camera in continuous auto-exposure and polls its live
/// ISO / shutter / aperture so we can derive the scene's true light value.
final class CameraMeteringService: NSObject, ObservableObject {
    @Published var deviceISO: Double = 100
    @Published var deviceShutterSeconds: Double = 1.0 / 125
    @Published var deviceAperture: Double = 1.8
    @Published var isRunning = false
    @Published var errorMessage: String?
    @Published var permissionDenied = false

    let session = AVCaptureSession()
    private var device: AVCaptureDevice?
    private var pollTimer: Timer?
    private let sessionQueue = DispatchQueue(label: "com.exposurecalculator.session")

    func start() {
        AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
            guard let self else { return }
            DispatchQueue.main.async {
                if !granted {
                    self.permissionDenied = true
                    return
                }
                self.beginSession()
            }
        }
    }

    private func beginSession() {
        sessionQueue.async { [weak self] in
            self?.configureSessionIfNeeded()
            if let session = self?.session, !session.isRunning {
                session.startRunning()
            }
            DispatchQueue.main.async {
                self?.isRunning = true
                self?.startPolling()
            }
        }
    }

    func stop() {
        pollTimer?.invalidate()
        pollTimer = nil
        sessionQueue.async { [weak self] in
            if self?.session.isRunning == true {
                self?.session.stopRunning()
            }
        }
        isRunning = false
    }

    private func configureSessionIfNeeded() {
        guard session.inputs.isEmpty else { return }
        session.beginConfiguration()
        session.sessionPreset = .high

        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
            DispatchQueue.main.async { self.errorMessage = "No back camera found on this device." }
            session.commitConfiguration()
            return
        }
        device = camera

        do {
            let input = try AVCaptureDeviceInput(device: camera)
            if session.canAddInput(input) {
                session.addInput(input)
            }
            try camera.lockForConfiguration()
            if camera.isExposureModeSupported(.continuousAutoExposure) {
                camera.exposureMode = .continuousAutoExposure
            }
            camera.unlockForConfiguration()
        } catch {
            DispatchQueue.main.async { self.errorMessage = error.localizedDescription }
        }

        session.commitConfiguration()
    }

    private func startPolling() {
        pollTimer?.invalidate()
        // 10 Hz is plenty for a hand-held light meter and keeps CPU/battery use low.
        pollTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self, let device = self.device else { return }
            self.deviceISO = Double(device.iso)
            self.deviceShutterSeconds = device.exposureDuration.seconds
            self.deviceAperture = Double(device.lensAperture)
        }
    }
}
