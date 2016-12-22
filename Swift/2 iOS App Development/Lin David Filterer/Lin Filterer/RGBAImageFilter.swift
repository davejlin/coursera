import Foundation

public class RGBAImageFilter {
    
    let newAlphaValue: Int!
    let changeRed: Bool!
    let changeGreen: Bool!
    let changeBlue: Bool!
    let makeBlackAndWhite: Bool!
    let floorModifier: Double!
    let ceilingModifier: Double!
    
    var aveRed: Double!
    var aveGreen: Double!
    var aveBlue: Double!
    var sumColor: Int!
    
    public init (
        newAlphaValue: Int,
        changeRed: Bool,
        changeGreen: Bool,
        changeBlue: Bool,
        floorModifier: Double,
        ceilingModifier: Double,
        makeBlackAndWhite: Bool = false) {
            
        self.newAlphaValue = newAlphaValue
            self.changeRed = changeRed
            self.changeBlue = changeBlue
            self.changeGreen = changeGreen
            self.floorModifier = floorModifier
            self.ceilingModifier = ceilingModifier
            self.makeBlackAndWhite = makeBlackAndWhite
    }
    
    public func modifyRGBAImage(rgbaImage: RGBAImage) -> RGBAImage {
        
        (aveRed, aveGreen, aveBlue, sumColor) = findColorProperties(rgbaImage)
        
        //NSLog("\n\nThis image's original average values are:\nAve Red: \(aveRed)\nAve Green: \(aveGreen)\nAve Blue: \(aveBlue)\nSum Color: \(sumColor)\n\n")
        
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
        let sumPixelColor = Int(pixel.red) + Int(pixel.green) + Int(pixel.blue)
        if sumPixelColor < sumColor {
            modifier = floorModifier
        }
        
        let redDelta = Double(pixel.red) - aveRed
        let greenDelta = Double(pixel.green) - aveGreen
        let blueDelta = Double(pixel.blue) - aveBlue
        
        if makeBlackAndWhite == true {
            let avePixelColor = checkValueLimits(maxValue: 255, minValue: 0, value: Int(0.03333*(10.0-modifier) * Double(sumPixelColor)))
            pixel.red = avePixelColor
            pixel.green = avePixelColor
            pixel.blue = avePixelColor
        } else {
            if changeRed == true {
                pixel.red = checkValueLimits(maxValue: 255, minValue: 0, value: Int(aveRed+(modifier*redDelta)))
            }
            
            if changeGreen == true {
                pixel.green = checkValueLimits(maxValue: 255, minValue: 0, value: Int(aveGreen+(modifier*greenDelta)))
            }
            
            if changeBlue == true {
                pixel.blue = checkValueLimits(maxValue: 255, minValue: 0, value: Int(aveBlue+(modifier*blueDelta)))
            }
        }
            
        pixel.alpha = checkValueLimits(maxValue: 255, minValue: 0, value: newAlphaValue)
        
        rgbaImage.pixels[index] = pixel
        return rgbaImage
    }
    
    func checkValueLimits(maxValue maxValue: Int, minValue: Int, value: Int) -> UInt8 {
        return UInt8(max(min(maxValue,value),minValue))
    }
    
    func findColorProperties(rgbaImage: RGBAImage) -> (Double!, Double!, Double!, Int!) {
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
        let aveRed = Double(totalRed / pixelCount)
        let aveGreen = Double(totalGreen / pixelCount)
        let aveBlue = Double(totalBlue / pixelCount)
        let sumColor = Int(aveRed + aveGreen + aveBlue)
        return (aveRed, aveGreen, aveBlue, sumColor)
    }
}