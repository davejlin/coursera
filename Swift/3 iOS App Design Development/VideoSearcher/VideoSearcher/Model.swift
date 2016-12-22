//
//  Model.swift
//  VideoSearcher
//

import Foundation
class Model {
    var apiKey = "AIzaSyB18GVV6JFtqvr4bXmiNbGd_ECg6SVK3JQ"
    var channelsArray = ["Coursera", "numberphile", "minutephysics","1veritasium"]
    let nResults=50
    var videosArray: Array<Dictionary<NSObject, AnyObject>> = []
    var channelsDataArray: Array<Dictionary<NSObject, AnyObject>> = []
}
