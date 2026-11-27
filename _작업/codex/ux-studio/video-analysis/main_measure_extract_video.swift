import Foundation
import AVFoundation
import AppKit
let args=CommandLine.arguments
let asset=AVURLAsset(url:URL(fileURLWithPath:args[1]))
let out=URL(fileURLWithPath:args[2],isDirectory:true)
try FileManager.default.createDirectory(at:out,withIntermediateDirectories:true)
let step=Double(args[3])!,duration=CMTimeGetSeconds(asset.duration)
let start=args.count>4 ? Double(args[4])! : 0
let end=args.count>5 ? min(Double(args[5])!,duration) : duration
let format=args.count>6 ? args[6] : "jpg"
let prefix=args.count>7 ? args[7] : "frame"
let generator=AVAssetImageGenerator(asset:asset)
generator.appliesPreferredTrackTransform=true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
var times:[Double]=[]
if start<=end { for i in 0...Int(floor((end-start)/step)) { times.append(start+Double(i)*step) } }
if start==0 && abs(end-duration)<0.001 {
 let last=max(0,duration-0.04)
 if let t=times.last, last-t>0.05 {times.append(last)}
}
var results:[[String:Any]]=[]
for (i,second) in times.enumerated() {
 do {
  var actual=CMTime.zero
  let cg=try generator.copyCGImage(at:CMTime(seconds:second,preferredTimescale:60000),actualTime:&actual)
  let rep=NSBitmapImageRep(cgImage:cg)
  let name=String(format:"%@_%05d.%@",prefix,i,format)
  let data=rep.representation(using:format=="png" ? .png : .jpeg,properties:format=="png" ? [:] : [.compressionFactor:0.86])!
  try data.write(to:out.appendingPathComponent(name))
  results.append(["index":i,"requested":second,"actual":CMTimeGetSeconds(actual),"file":name,"width":cg.width,"height":cg.height,"format":format])
 } catch {results.append(["index":i,"requested":second,"error":String(describing:error)])}
 if i % 30==0 {print("extracted \(i) at \(second)s");fflush(stdout)}
}
let result:[String:Any]=["durationSeconds":duration,"stepSeconds":step,"startSeconds":start,"endSeconds":end,"appliesPreferredTrackTransform":true,"toleranceBeforeSeconds":0,"toleranceAfterSeconds":0,"jpegCompressionFactor":format=="jpg" ? 0.86 : NSNull(),"format":format,"frames":results]
let data=try JSONSerialization.data(withJSONObject:result,options:[.prettyPrinted,.sortedKeys])
try data.write(to:out.appendingPathComponent(prefix=="frame" ? "index.json" : prefix+"_index.json"))
print("done \(results.count)")
