import Foundation

/// Exposure Value math for a manual film camera.
///
/// The phone's camera auto-exposure gives us a correctly-exposed
/// (deviceISO, deviceShutter, deviceAperture) triple for the current scene.
/// From that we derive the scene's Light Value at ISO 100 (LV/EV100), which
/// is independent of the phone's own settings. From LV100 and the film's
/// ISO we can then solve for any correctly-exposed aperture/shutter pair.
enum ExposureMath {

    /// Full-stop apertures, widest to smallest.
    static let apertures: [Double] = [1.0, 1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11.0, 16.0, 22.0, 32.0]

    /// Full-stop shutter speeds in seconds, fastest to slowest.
    static let shutterSpeeds: [Double] = [
        1.0/8000, 1.0/4000, 1.0/2000, 1.0/1000, 1.0/500, 1.0/250, 1.0/125,
        1.0/60, 1.0/30, 1.0/15, 1.0/8, 1.0/4, 1.0/2, 1, 2, 4, 8, 15, 30
    ]

    /// Scene Light Value at ISO 100, derived from the phone's live auto-exposure reading.
    static func lightValue100(deviceISO: Double, deviceShutterSeconds: Double, deviceAperture: Double) -> Double {
        guard deviceShutterSeconds > 0, deviceISO > 0 else { return .nan }
        let evAtDeviceISO = log2((deviceAperture * deviceAperture) / deviceShutterSeconds)
        return evAtDeviceISO - log2(deviceISO / 100.0)
    }

    /// The EV a correctly-exposed pair must hit once you account for the film's ISO.
    static func targetEV(lightValue100: Double, filmISO: Double) -> Double {
        lightValue100 + log2(filmISO / 100.0)
    }

    /// Given a chosen aperture, solve the matching shutter speed for this scene and film.
    static func shutterSeconds(forAperture n: Double, lightValue100: Double, filmISO: Double) -> Double {
        let ev = targetEV(lightValue100: lightValue100, filmISO: filmISO)
        return (n * n) / pow(2, ev)
    }

    /// Given a chosen shutter speed, solve the matching aperture for this scene and film.
    static func aperture(forShutterSeconds t: Double, lightValue100: Double, filmISO: Double) -> Double {
        let ev = targetEV(lightValue100: lightValue100, filmISO: filmISO)
        return sqrt(t * pow(2, ev))
    }

    /// Every full-stop aperture paired with its correctly-exposed shutter speed for this scene/film.
    static func equivalentPairs(lightValue100: Double, filmISO: Double) -> [(aperture: Double, shutter: Double)] {
        apertures.map { n in
            (aperture: n, shutter: shutterSeconds(forAperture: n, lightValue100: lightValue100, filmISO: filmISO))
        }
    }

    static func formatShutter(_ seconds: Double) -> String {
        guard seconds.isFinite, seconds > 0 else { return "—" }
        if seconds >= 1 {
            let rounded = (seconds * 10).rounded() / 10
            return rounded == rounded.rounded() ? "\(Int(rounded))s" : String(format: "%.1fs", rounded)
        }
        let denominator = (1 / seconds).rounded()
        return "1/\(Int(denominator))"
    }

    static func formatAperture(_ n: Double) -> String {
        guard n.isFinite, n > 0 else { return "—" }
        return n.truncatingRemainder(dividingBy: 1) == 0 ? "f/\(Int(n))" : String(format: "f/%.1f", n)
    }
}
