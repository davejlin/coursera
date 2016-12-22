import Foundation

public class RGBAImageProcessor {
    var imageDefaultsDictionary: [String:RGBAImageFilter]!
    
    public init() {
        self.imageDefaultsDictionary = [String:RGBAImageFilter]()
        initDictionary()
    }
    
    public func processRGBAImageWithFilters(var rgbaImage rgbaImage: RGBAImage, filterPipeline: [RGBAImageFilter]) -> RGBAImage {
        for filter in filterPipeline {
            rgbaImage = filter.modifyRGBAImage(rgbaImage)
        }
        return rgbaImage
    }
    
    public func processRGBAImageWithFilterNames(var rgbaImage rgbaImage: RGBAImage, filterNamesPipeline: [String]) -> RGBAImage {
        for filterName in filterNamesPipeline {
            if let filter = imageDefaultsDictionary[filterName] {
                rgbaImage = filter.modifyRGBAImage(rgbaImage)
            }
        }
        return rgbaImage
    }
    
    func initDictionary() {
        imageDefaultsDictionary["Red Filter"] = RGBAImageFilter(newAlphaValue: 255, changeRed: true, changeGreen: false, changeBlue: false, floorModifier: 2, ceilingModifier: 2)
        
        imageDefaultsDictionary["Green Filter"] = RGBAImageFilter(newAlphaValue: 255, changeRed: false, changeGreen: true, changeBlue: false, floorModifier: 2, ceilingModifier: 2)
        
        imageDefaultsDictionary["Blue Filter"] = RGBAImageFilter(newAlphaValue: 255, changeRed: false, changeGreen: false, changeBlue: true, floorModifier: 2, ceilingModifier: 2)
        
        imageDefaultsDictionary["Yellow Filter"] = RGBAImageFilter(newAlphaValue: 255, changeRed: true, changeGreen: true, changeBlue: false, floorModifier: 2, ceilingModifier: 2)
        
        imageDefaultsDictionary["Magenta Filter"] = RGBAImageFilter(newAlphaValue: 255, changeRed: true, changeGreen: false, changeBlue: true, floorModifier: 2, ceilingModifier: 2)
        
        imageDefaultsDictionary["Double Contrast"] = RGBAImageFilter(newAlphaValue: 255, changeRed: true, changeGreen: true, changeBlue: true, floorModifier: 2, ceilingModifier: 2)
        
        imageDefaultsDictionary["Half Contrast"] = RGBAImageFilter(newAlphaValue: 255, changeRed: true, changeGreen: true, changeBlue: true, floorModifier: -2, ceilingModifier: -2)
        
        imageDefaultsDictionary["No Transparancy"] = RGBAImageFilter(newAlphaValue: 255, changeRed: false, changeGreen: false, changeBlue: false, floorModifier: 1, ceilingModifier: 1)
        
        imageDefaultsDictionary["Medium Transparancy"] = RGBAImageFilter(newAlphaValue: 128, changeRed: false, changeGreen: false, changeBlue: false, floorModifier: 1, ceilingModifier: 1)
        
        imageDefaultsDictionary["Full Transparancy"] = RGBAImageFilter(newAlphaValue: 0, changeRed: false, changeGreen: false, changeBlue: false, floorModifier: 1, ceilingModifier: 1)
    }
}