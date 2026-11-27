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
let png = args.count > 4 && args[4] == "png"
let selectedTimes = args.count > 5 ? args[5].split(separator: ",").compactMap { Double($0) } : []
let duration = CMTimeGetSeconds(asset.duration)
var results: [[String:Any]] = []
let requestedTimes = selectedTimes.isEmpty ? (0...Int(floor(duration / step))).map { Double($0) * step } : selectedTimes
for (index, second) in requestedTimes.enumerated() {
 do {
  var actual = CMTime.zero
  let cg = try generator.copyCGImage(at: CMTime(seconds: second, preferredTimescale: 600), actualTime: &actual)
  let rep = NSBitmapImageRep(cgImage: cg)
  let name = String(format: "frame_%05d.%@", index, png ? "png" : "jpg")
  let data = rep.representation(using: png ? .png : .jpeg, properties: png ? [:] : [.compressionFactor: 0.88])!
  try data.write(to: out.appendingPathComponent(name))
  results.append(["index":index,"requested":second,"actual":CMTimeGetSeconds(actual),"file":name,"width":cg.width,"height":cg.height])
 } catch { results.append(["index":index,"requested":second,"error":String(describing:error)]) }
 if index % 30 == 0 {print("extracted \(index) at \(second)s");fflush(stdout)}
}
let data = try JSONSerialization.data(withJSONObject: ["duration":duration,"step":step,"format":png ? "png" : "jpeg","requestedTimesTolerance":"zero","appliesPreferredTrackTransform":true,"frames":results], options:[.prettyPrinted,.sortedKeys])
try data.write(to:out.appendingPathComponent("index.json"))
print("done \(results.count)")
