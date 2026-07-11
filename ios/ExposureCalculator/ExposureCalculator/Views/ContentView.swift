import SwiftUI

private enum MeteringMode: String, CaseIterable, Identifiable {
    case aperturePriority = "Set Aperture"
    case shutterPriority = "Set Shutter"
    case table = "Full Table"
    var id: String { rawValue }
}

struct ContentView: View {
    @StateObject private var camera = CameraMeteringService()

    @State private var filmISO: Double = 400
    @State private var mode: MeteringMode = .aperturePriority
    @State private var apertureIndex = 4 // f/4 default
    @State private var shutterIndex = 6  // 1/125 default

    private var lightValue100: Double {
        ExposureMath.lightValue100(
            deviceISO: camera.deviceISO,
            deviceShutterSeconds: camera.deviceShutterSeconds,
            deviceAperture: camera.deviceAperture
        )
    }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {
                cameraPreview
                    .frame(height: 280)
                    .clipped()

                ScrollView {
                    VStack(spacing: 20) {
                        isoField
                        modePicker
                        resultCard
                    }
                    .padding(20)
                }
            }
        }
        .preferredColorScheme(.dark)
        .onAppear { camera.start() }
        .onDisappear { camera.stop() }
        .alert("Camera Access Needed", isPresented: $camera.permissionDenied) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Enable camera access in Settings so the meter can read the light.")
        }
    }

    private var cameraPreview: some View {
        ZStack(alignment: .bottomLeading) {
            CameraPreviewView(session: camera.session)

            HStack {
                Label(lightValue100.isFinite ? String(format: "LV %.1f", lightValue100) : "Metering…",
                      systemImage: "light.max")
                Spacer()
            }
            .font(.system(.footnote, design: .rounded).weight(.semibold))
            .foregroundStyle(.white)
            .padding(10)
            .background(.black.opacity(0.55))
        }
    }

    private var isoField: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("FILM ISO")
                .font(.caption.weight(.bold))
                .foregroundStyle(.orange)
            HStack {
                Stepper(value: $filmISO, in: 25...6400, step: filmISO < 100 ? 25 : (filmISO < 400 ? 50 : 100)) {
                    Text("\(Int(filmISO)) ISO")
                        .font(.system(.title2, design: .rounded).weight(.bold))
                        .foregroundStyle(.white)
                }
            }
        }
        .padding(16)
        .background(Color(white: 0.12))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    private var modePicker: some View {
        Picker("Mode", selection: $mode) {
            ForEach(MeteringMode.allCases) { m in
                Text(m.rawValue).tag(m)
            }
        }
        .pickerStyle(.segmented)
    }

    @ViewBuilder
    private var resultCard: some View {
        switch mode {
        case .aperturePriority:
            aperturePriorityCard
        case .shutterPriority:
            shutterPriorityCard
        case .table:
            tableCard
        }
    }

    private var aperturePriorityCard: some View {
        let n = ExposureMath.apertures[apertureIndex]
        let t = ExposureMath.shutterSeconds(forAperture: n, lightValue100: lightValue100, filmISO: filmISO)

        return VStack(spacing: 16) {
            Text("Aperture on your camera")
                .font(.caption.weight(.bold))
                .foregroundStyle(.secondary)
            Picker("Aperture", selection: $apertureIndex) {
                ForEach(ExposureMath.apertures.indices, id: \.self) { i in
                    Text(ExposureMath.formatAperture(ExposureMath.apertures[i])).tag(i)
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 100)

            Divider().overlay(Color.white.opacity(0.15))

            Text("SET YOUR SHUTTER TO")
                .font(.caption.weight(.bold))
                .foregroundStyle(.orange)
            Text(ExposureMath.formatShutter(t))
                .font(.system(size: 44, weight: .heavy, design: .rounded))
                .foregroundStyle(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(20)
        .background(Color(white: 0.12))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    private var shutterPriorityCard: some View {
        let t = ExposureMath.shutterSpeeds[shutterIndex]
        let n = ExposureMath.aperture(forShutterSeconds: t, lightValue100: lightValue100, filmISO: filmISO)

        return VStack(spacing: 16) {
            Text("Shutter speed on your camera")
                .font(.caption.weight(.bold))
                .foregroundStyle(.secondary)
            Picker("Shutter", selection: $shutterIndex) {
                ForEach(ExposureMath.shutterSpeeds.indices, id: \.self) { i in
                    Text(ExposureMath.formatShutter(ExposureMath.shutterSpeeds[i])).tag(i)
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 100)

            Divider().overlay(Color.white.opacity(0.15))

            Text("SET YOUR APERTURE TO")
                .font(.caption.weight(.bold))
                .foregroundStyle(.orange)
            Text(ExposureMath.formatAperture(n))
                .font(.system(size: 44, weight: .heavy, design: .rounded))
                .foregroundStyle(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(20)
        .background(Color(white: 0.12))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    private var tableCard: some View {
        let pairs = ExposureMath.equivalentPairs(lightValue100: lightValue100, filmISO: filmISO)

        return VStack(spacing: 0) {
            HStack {
                Text("APERTURE").font(.caption.weight(.bold))
                Spacer()
                Text("SHUTTER").font(.caption.weight(.bold))
            }
            .foregroundStyle(.orange)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)

            ForEach(pairs, id: \.aperture) { pair in
                HStack {
                    Text(ExposureMath.formatAperture(pair.aperture))
                    Spacer()
                    Text(ExposureMath.formatShutter(pair.shutter))
                }
                .font(.system(.body, design: .rounded).weight(.semibold))
                .foregroundStyle(.white)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                Divider().overlay(Color.white.opacity(0.1))
            }
        }
        .background(Color(white: 0.12))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

#Preview {
    ContentView()
}
