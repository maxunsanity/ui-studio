import Foundation
import AVFoundation
import AppKit
let args = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let out = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
let step = Double(args[3])!
let duration = CMTimeGetSeconds(asset.duration)
var results: [[String:Any]] = []
for index in 0...Int(floor(duration / step)) {
 let second = Double(index) * step
 do {
  var actual = CMTime.zero
  let cg = try generator.copyCGImage(at: CMTime(seconds: second, preferredTimescale: 600), actualTime: &actual)
  let rep = NSBitmapImageRep(cgImage: cg)
  let name = String(format: "frame_%05d.jpg", index)
  let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.86])!
  try data.write(to: out.appendingPathComponent(name))
  results.append(["index":index,"requested":second,"actual":CMTimeGetSeconds(actual),"file":name,"width":cg.width,"height":cg.height])
 } catch { results.append(["index":index,"requested":second,"error":String(describing:error)]) }
 if index % 30 == 0 {print("extracted \(index) at \(second)s");fflush(stdout)}
}
let data = try JSONSerialization.data(withJSONObject: ["duration":duration,"step":step,"frames":results], options:[.prettyPrinted,.sortedKeys])
try data.write(to:out.appendingPathComponent("index.json"))
print("done \(results.count)")
