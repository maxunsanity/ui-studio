import Foundation
import AVFoundation
let input=URL(fileURLWithPath:CommandLine.arguments[1])
let asset=AVURLAsset(url:input)
let duration=CMTimeGetSeconds(asset.duration)
let tracks=asset.tracks(withMediaType:.video)
var result:[String:Any]=["durationSeconds":duration,"videoTrackCount":tracks.count,"timeScale":asset.duration.timescale]
if let t=tracks.first {
 let p=t.preferredTransform,n=t.naturalSize,z=n.applying(p)
 let w=abs(z.width),h=abs(z.height)
 result["naturalSize"]=[n.width,n.height]
 result["displaySize"]=[w,h]
 result["orientation"]=w<h ? "portrait" : (w>h ? "landscape" : "square")
 result["preferredTransform"]=["a":p.a,"b":p.b,"c":p.c,"d":p.d,"tx":p.tx,"ty":p.ty]
 result["nominalFrameRate"]=t.nominalFrameRate
 result["estimatedDataRate"]=t.estimatedDataRate
 result["trackTimeScale"]=t.naturalTimeScale
}
let data=try JSONSerialization.data(withJSONObject:result,options:[.prettyPrinted,.sortedKeys])
print(String(data:data,encoding:.utf8)!)
