import UIKit
import Foundation

public class ImageProcessor{
    let rgbaImage: RGBAImage!
    
    required public init(image: UIImage){
        self.rgbaImage = RGBAImage(image: image)
    }
    
    /*
     * Adjusts the brightness of the given image based
     * on the given ratio parameter.
     */
    public func adjustBrightness(ratio: Int) -> UIImage? {
        // compute the parameter for the brightness
        let adjust = 255*ratio/100
        
        // loop through the img and adjust each pixel's colour
        for y in 0..<self.rgbaImage.height {
            for x in 0..<self.rgbaImage.width{
                // compute the current pixel's index
                let index = y * self.rgbaImage.width + x
                
                // get the pixel for the computed index
                var pixel = self.rgbaImage.pixels[index]
                
                // compute the colours for the pixel
                pixel.blue = UInt8(min(255,(Int(pixel.blue) + adjust)))
                pixel.green = UInt8(min(255,(Int(pixel.green) + adjust)))
                pixel.red = UInt8(min(255,(Int(pixel.red) + adjust)))
                
                // update the pixel
                self.rgbaImage.pixels[index] = pixel
            }
        }
        
        return self.rgbaImage.toUIImage()
    }
    
    /*
     * Inverts the colours of the image
     */
    public func invertColours() -> UIImage? {
        for y in 0..<self.rgbaImage.height {
            for x in 0..<self.rgbaImage.width{
                // compute the current pixel's index
                let index = y * self.rgbaImage.width + x
                
                // get the pixel for the computed index
                var pixel = self.rgbaImage.pixels[index]
                
                // invert the colours for the current pixel
                pixel.blue = UInt8(255 - Int(pixel.blue))
                pixel.green = UInt8(255 - Int(pixel.green))
                pixel.red = UInt8(255 - Int(pixel.red))
                
                // update the pixel
                self.rgbaImage.pixels[index] = pixel
            }
        }
        
        return self.rgbaImage.toUIImage()
    }
    
    /*
     * Adjust the contrast of the image
     */
    public func contrast(ratio: Int) -> UIImage? {
        var sumRed = 0
        var sumBlue = 0
        var sumGreen = 0
        
        for y in 0..<self.rgbaImage.height {
            for x in 0..<self.rgbaImage.width{
                // compute the current pixel's index
                let index = y * self.rgbaImage.width + x
                
                // get the pixel for the computed index
                var pixel = self.rgbaImage.pixels[index]
                
                sumBlue += Int(pixel.blue)
                sumGreen += Int(pixel.green)
                sumRed += Int(pixel.red)
            }
        }
        
        let avgRed = Int(sumRed) / self.rgbaImage.pixels.count
        let avgGreen = Int(sumGreen) /  self.rgbaImage.pixels.count
        let avgBlue = Int(sumBlue) /  self.rgbaImage.pixels.count
        
        for y in 0..<self.rgbaImage.height {
            for x in 0..<self.rgbaImage.width{
                // compute the current pixel's index
                let index = y * self.rgbaImage.width + x
                
                // get the pixel for the computed index
                var pixel = self.rgbaImage.pixels[index]
                
                let redDelta = Int(pixel.red) - avgRed
                let greenDelta = Int(pixel.green) - avgGreen
                let blueDelta = Int(pixel.blue) - avgBlue
                
                pixel.red = UInt8(max(min(255,(avgRed + ratio * redDelta)),0))
                pixel.green = UInt8(max(min(255,(avgGreen + ratio * greenDelta)),0))
                pixel.blue = UInt8(max(min(255,(avgBlue + ratio * blueDelta)),0))
                
                // update the pixel
                self.rgbaImage.pixels[index] = pixel
            }
        }
        
        
        return self.rgbaImage.toUIImage()
    }
    
    /*
    * Adjust the saturation of the image
    */
    public func saturation(ratio: Double) -> UIImage? {
        let adjust = UInt8(0.01 * ratio)
        
        for y in 0..<self.rgbaImage.height {
            for x in 0..<self.rgbaImage.width{
                let index = y * self.rgbaImage.width + x
                var pixel = self.rgbaImage.pixels[index]
                
                let maxChannel = UInt8(max(pixel.blue, pixel.red, pixel.green))
                
                if(pixel.blue != maxChannel){
                    pixel.blue = (maxChannel - pixel.blue) * adjust
                }
                
                if(pixel.green != maxChannel){
                    pixel.green = (maxChannel - pixel.green) * adjust
                }
                
                if(pixel.red != maxChannel){
                    pixel.red = (maxChannel - pixel.red) * adjust
                }
                
                self.rgbaImage.pixels[index] = pixel
            }
        }
        
        return self.rgbaImage.toUIImage()
    }
}