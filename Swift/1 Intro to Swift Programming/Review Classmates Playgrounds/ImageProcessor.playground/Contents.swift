//: Playground - noun: a place where people can play

import UIKit

func applyFilter(name: String) -> UIImage?{
    let image = UIImage(named: "sample")!
    let filter = ImageProcessor(image: image)
    
    if(name == "brightness"){
        return filter.adjustBrightness(20)
    } else if(name == "invert"){
        return filter.invertColours()
    } else if(name == "contrast"){
        return filter.contrast(20)
    } else if(name == "saturation"){
        return filter.saturation(20)
    } else {
        return nil
    }
}


applyFilter("invert")
applyFilter("brightness")
applyFilter("contrast")
applyFilter("saturation")



let image = UIImage(named: "sample")!
// Example on how to apply various filters
let filter = ImageProcessor(image: image)
filter.adjustBrightness(20)
filter.saturation(15)
filter.invertColours()
filter.contrast(56)

