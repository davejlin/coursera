import Foundation

public class RGBAImageFilter {
    
    let newAlphaValue: Int!
    let changeRed: Bool!
    let changeGreen: Bool!
    let changeBlue: Bool!
    let floorModifier: Int!
    let ceilingModifier: Int!
    
    var aveRed: Int!
    var aveGreen: Int!
    var aveBlue: Int!
    var sumColor: Int!
    
    public init (
        newAlphaValue: Int,
        changeRed: Bool,
        changeGreen: Bool,
        changeBlue: Bool,
        floorModifier: Int,
        ceilingModifier: Int) {
            
        self.newAlphaValue = newAlphaValue
            self.changeRed = changeRed
            self.changeBlue = changeBlue
            self.changeGreen = changeGreen
            self.floorModifier = floorModifier
            self.ceilingModifier = ceilingModifier
    }
    
    public func modifyRGBAImage(rgbaImage: RGBAImage) -> RGBAImage {
        
        (aveRed, aveGreen, aveBlue, sumColor) = findColorProperties(rgbaImage)
            
        NSLog("\n\nThis image's original average values are:\nAve Red: \(aveRed)\nAve Green: \(aveGreen)\nAve Blue: \(aveBlue)\nSum Color: \(sumColor)\n\n")
        
        return modifyImage(rgbaImage)
    }
    
    func modifyImage (var rgbaImage: RGBAImage) -> RGBAImage {
        for y in 0..<rgbaImage.height {
            for x in 0..<rgbaImage.width {
                let index = y*rgbaImage.width + x
                let pixel = rgbaImage.pixels[index]
                rgbaImage = modifyPixelAtIndex(rgbaImage, index: index, pixel: pixel)
            }
        }
            
        return rgbaImage
    }
    
    func modifyPixelAtIndex(rgbaImage: RGBAImage, index: Int, var pixel: Pixel) -> RGBAImage {
        
        var modifier = ceilingModifier
        if (Int(pixel.red) + Int(pixel.green) + Int(pixel.blue) < sumColor) {
            modifier = floorModifier
        }
        
        let redDelta = Int(pixel.red) - aveRed
        let greenDelta = Int(pixel.green) - aveGreen
        let blueDelta = Int(pixel.blue) - aveBlue
        
        if changeRed == true {
            pixel.red = checkValueLimits(maxValue: 255, minValue: 0, value: aveRed+(modifier*redDelta))
        }
        
        if changeGreen == true {
            pixel.green = checkValueLimits(maxValue: 255, minValue: 0, value: aveGreen+(modifier*greenDelta))
        }
        
        if changeBlue == true {
            pixel.blue = checkValueLimits(maxValue: 255, minValue: 0, value: aveBlue+(modifier*blueDelta))
        }
        
        pixel.alpha = checkValueLimits(maxValue: 255, minValue: 0, value: newAlphaValue)
        
        rgbaImage.pixels[index] = pixel
        return rgbaImage
    }
    
    func checkValueLimits(maxValue maxValue: Int, minValue: Int, value: Int) -> UInt8 {
        return UInt8(max(min(maxValue,value),minValue))
    }
    
    func findColorProperties(rgbaImage: RGBAImage) -> (Int!, Int!, Int!, Int!) {
        var totalRed = 0
        var totalGreen = 0
        var totalBlue = 0
        
        for y in 0..<rgbaImage.height {
            for x in 0..<rgbaImage.width {
                let index = y*rgbaImage.width + x
                let pixel = rgbaImage.pixels[index]
                totalRed   += Int(pixel.red)
                totalGreen += Int(pixel.blue)
                totalBlue  += Int(pixel.green)
            }
        }
        
        let pixelCount = rgbaImage.width * rgbaImage.height
        let aveRed = totalRed / pixelCount
        let aveGreen = totalGreen / pixelCount
        let aveBlue = totalBlue / pixelCount
        let sumColor = aveRed + aveGreen + aveBlue
        return (aveRed, aveGreen, aveBlue, sumColor)
    }
}