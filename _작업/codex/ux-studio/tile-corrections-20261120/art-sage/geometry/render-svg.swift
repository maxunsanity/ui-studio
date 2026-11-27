import AppKit
let manifest=URL(fileURLWithPath:CommandLine.arguments[1])
let object=try JSONSerialization.jsonObject(with:Data(contentsOf:manifest)) as! [String:Any]
for asset in object["assets"] as! [[String:Any]] {
 let source=URL(fileURLWithPath:asset["source"] as! String)
 let w=asset["width"] as! Int, h=asset["height"] as! Int
 guard let image=NSImage(contentsOf:source) else { fatalError("Cannot read \(source.path)") }
 let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:w,pixelsHigh:h,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
 NSGraphicsContext.saveGraphicsState()
 NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:rep)
 NSGraphicsContext.current!.imageInterpolation = .high
 let rect=CGRect(x:0,y:0,width:w,height:h)
 NSColor.clear.set();rect.fill()
 image.draw(in:rect,from:.zero,operation:.copy,fraction:1)
 NSGraphicsContext.restoreGraphicsState()
 let dest=source.deletingPathExtension().appendingPathExtension("png")
 try rep.representation(using:.png,properties:[:])!.write(to:dest)
 print(dest.lastPathComponent)
}
