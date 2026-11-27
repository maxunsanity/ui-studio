import Foundation
import AVFoundation
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let asset = AVURLAsset(url: url)
let duration = CMTimeGetSeconds(asset.duration)
let tracks = asset.tracks(withMediaType: .video)
var result: [String: Any] = ["duration": duration, "tracks": tracks.count]
if let t = tracks.first {
 let size = t.naturalSize.applying(t.preferredTransform)
 result["width"] = abs(size.width)
 result["height"] = abs(size.height)
 result["fps"] = t.nominalFrameRate
}
let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted,.sortedKeys])
print(String(data:data, encoding:.utf8)!)
