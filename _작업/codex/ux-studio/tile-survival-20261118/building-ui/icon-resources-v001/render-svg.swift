import AppKit
import Foundation

let directory = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let files = try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)
for source in files.filter({ $0.pathExtension == "svg" }).sorted(by: { $0.lastPathComponent < $1.lastPathComponent }) {
    guard let image = NSImage(contentsOf: source) else { fatalError("SVG load failed: \(source.path)") }
    guard let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 128, pixelsHigh: 128, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 512, bitsPerPixel: 32),
          let context = NSGraphicsContext(bitmapImageRep: bitmap) else { fatalError("RGBA allocation failed") }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.shouldAntialias = true
    NSColor.clear.set()
    NSRect(x: 0, y: 0, width: 128, height: 128).fill(using: .copy)
    image.draw(in: NSRect(x: 0, y: 0, width: 128, height: 128), from: .zero, operation: .sourceOver, fraction: 1)
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()
    guard let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("PNG encoding failed") }
    try png.write(to: source.deletingPathExtension().appendingPathExtension("png"), options: .atomic)
    print("rendered \(source.lastPathComponent)")
}
