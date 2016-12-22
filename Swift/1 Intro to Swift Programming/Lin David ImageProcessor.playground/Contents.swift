// Coursera Introduction to Swift Programming
// Swift final programming assignment
// October 2015
// David Lin

import UIKit

let image = UIImage(named: "sample")

// Process the image!

var rgbaImage = RGBAImage(image: image!)!

// You can create your own custom filters and create a filter pipeline, specifying an indefinite number of custom filters in your desired sequence:

// Custom image filter parameters:

// newAlphaValue: the alpha value you want to change all the image's pixels alpha value to
// changeRed: set to true if you want to apply the modifier to the pixel's red color
// changeGreen: set to true if you want to apply the modifier to the pixel's green color
// changeBlue: set to true if you want to apply the modifier to the pixel's blue color
// floorModifier: the multiplicative value to change the value from the average if the sum of the pixel's red, green, and blue values is less than the sum of the average red, average green, and average blue values
// ceilingModifier: the multiplicative value to change the value from the average if the sum of the pixel's red, green, and blue values is greater than the sum of the average red, average green, and average blue values


let redFilter = RGBAImageFilter(newAlphaValue: 255, changeRed: true, changeGreen: false, changeBlue: false, floorModifier: 1, ceilingModifier: 2)

let greenFilter = RGBAImageFilter(newAlphaValue: 255, changeRed: false, changeGreen: true, changeBlue: false, floorModifier: 1, ceilingModifier: 2)

let blueFilter = RGBAImageFilter(newAlphaValue: 255, changeRed: false, changeGreen: false, changeBlue: true, floorModifier: 1, ceilingModifier: 2)

let mediumTranparencyFilter = RGBAImageFilter(newAlphaValue: 128, changeRed: false, changeGreen: false, changeBlue: false, floorModifier: 1, ceilingModifier: 1)

let filterPipeline = [blueFilter, greenFilter, redFilter, mediumTranparencyFilter]

let newImage1 = RGBAImageProcessor().processRGBAImageWithFilters(rgbaImage: rgbaImage, filterPipeline: filterPipeline).toUIImage()

// Default Filter Names:
// Or ... You can specify default filters by string name and create a filter name pipeline, specifying an indefinite number of default filters in your desired sequence:

// Valid filter default names are:
// 1. Red Filter
// 2. Green Filter
// 3. Blue Filter
// 4. Yellow Filter
// 5. Magenta Filter
// 6. Double Contrast
// 7. Half Contrast
// 8. No Transparancy
// 9. Medium Transparancy
// 10. Full Transparancy

let filterNamesPipeline = ["Magenta Filter", "Half Contrast", "Medium Transparancy"]

let newImage2 = RGBAImageProcessor().processRGBAImageWithFilterNames(rgbaImage: rgbaImage, filterNamesPipeline: filterNamesPipeline).toUIImage()





