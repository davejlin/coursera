//
//  PointsDraw.swift
//  FaceTrackerDavidLin
//
//  Created by Lin David, US-205 on 4/17/16.
//  Copyright © 2016 Lin David. All rights reserved.
//

import Foundation
import UIKit
import FaceTracker

class PointsDraw {
    var view: UIView!
    var overlayViews: [String: [UIView]]!
    var pointViews: [UIView]!
    var hatView: UIImageView!
    var noseView: UIImageView!
    var beardView: UIImageView!
    var eyebrowRightView: UIImageView!
    var eyebrowLeftView: UIImageView!
    var eyeRightView: UIImageView!
    var eyeLeftView: UIImageView!
    var lipsUpperView: UIImageView!
    var lipsLowerView: UIImageView!
    
    init () {
    }
    
    func setViews(mainView: UIView, overlayViews: [String: [UIView]], pointViews: [UIView], hatView: UIImageView, noseView: UIImageView, beardView: UIImageView, eyebrowRightView: UIImageView, eyebrowLeftView: UIImageView, eyeRightView: UIImageView, eyeLeftView: UIImageView, lipsUpperView: UIImageView, lipsLowerView: UIImageView) {
        self.view = mainView
        self.overlayViews = overlayViews
        self.pointViews = pointViews
        self.hatView = hatView
        self.noseView = noseView
        self.beardView = beardView
        self.eyebrowRightView = eyebrowRightView
        self.eyebrowLeftView = eyebrowLeftView
        self.eyeRightView = eyeRightView
        self.eyeLeftView = eyeLeftView
        self.lipsUpperView = lipsUpperView
        self.lipsLowerView = lipsLowerView
    }
    
    func trackFacialPoints(points: FacePoints?) {
        if let points = points {
            for (index, point) in points.leftEye.enumerate() {
                self.updateViewForFeature("leftEye", index: index, point: point, bgColor: UIColor.blueColor())
            }
            
            for (index, point) in points.rightEye.enumerate() {
                self.updateViewForFeature("rightEye", index: index, point: point, bgColor: UIColor.blueColor())
            }
            
            for (index, point) in points.leftBrow.enumerate() {
                self.updateViewForFeature("leftBrow", index: index, point: point, bgColor: UIColor.whiteColor())
            }
            
            for (index, point) in points.rightBrow.enumerate()
            {
                self.updateViewForFeature("rightBrow", index: index, point: point, bgColor: UIColor.whiteColor())
            }
            
            for (index, point) in points.nose.enumerate() {
                self.updateViewForFeature("nose", index: index, point: point, bgColor: UIColor.purpleColor())
            }
            
            for (index, point) in points.innerMouth.enumerate() {
                self.updateViewForFeature("innerMouth", index: index, point: point, bgColor: UIColor.redColor())
            }
            
            for (index, point) in points.outerMouth.enumerate(){
                self.updateViewForFeature("outerMouth", index: index, point: point, bgColor: UIColor.yellowColor())
            }
        }
        else {
            self.hideAllOverlayViews()
        }
    }
    
    func hideAllOverlayViews() {
        for (_, views) in self.overlayViews {
            for view in views {
                view.hidden = true
            }
        }
    }
    
    func updateViewForFeature(feature: String, index: Int, point: CGPoint, bgColor: UIColor) {
        
        let frame = CGRectMake(point.x-2, point.y-2, 4.0, 4.0)
        
        if self.overlayViews[feature] == nil {
            self.overlayViews[feature] = [UIView]()
        }
        
        if index < self.overlayViews[feature]!.count {
            self.overlayViews[feature]![index].frame = frame
            self.overlayViews[feature]![index].hidden = false
            self.overlayViews[feature]![index].backgroundColor = bgColor
        } else {
            let newView = UIView(frame: frame)
            newView.backgroundColor = bgColor
            newView.hidden = false
            self.view.addSubview(newView)
            self.overlayViews[feature]! += [newView]
        }
    }
    
    func trackFacialPointsMonochrome(points: FacePoints?) {
        if let points = points {
            // Allocate some views for the points if needed
            if (pointViews.count == 0) {
                let numPoints = points.getTotalNumberOFPoints()
                for _ in 0...numPoints {
                    let view = UIView()
                    view.backgroundColor = UIColor.greenColor()
                    self.view.addSubview(view)
                    
                    pointViews.append(view)
                }
            }
            
            // Set frame for each point view
            points.enumeratePoints({ (point, index) -> Void in
                let pointView = self.pointViews[index]
                let pointSize: CGFloat = 4
                
                pointView.hidden = false
                pointView.frame = CGRectIntegral(CGRectMake(point.x - pointSize / 2, point.y - pointSize / 2, pointSize, pointSize))
            })
        } else {
            for view in pointViews {
                view.hidden = true
            }
        }
    }
    
    func trackHat(points: FacePoints?, widthMultiplier: CGFloat, viewFrameXDivisor: CGFloat, viewFrameYMultiplier: CGFloat) {
        if let points = points {
            let eyeCornerDist = sqrt(pow(points.leftEye[5].x - points.rightEye[0].x, 2))
            let eyeToEyeCenter = CGPointMake((points.leftEye[0].x + points.rightEye[5].x) / 2, (points.leftEye[0].y + points.rightEye[5].y) / 2)
            
            let hatWidth = widthMultiplier * eyeCornerDist
            let hatHeight = (hatView.image!.size.height / hatView.image!.size.width) * hatWidth
            
            hatView.transform = CGAffineTransformIdentity
            
            hatView.frame = CGRectMake(eyeToEyeCenter.x - hatWidth / viewFrameXDivisor, eyeToEyeCenter.y - viewFrameYMultiplier * hatHeight, hatWidth, hatHeight)
            hatView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: hatView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            hatView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            hatView.hidden = true
        }
    }
    
    func trackNose(points: FacePoints?, widthMultiplier: CGFloat, viewFrameXDivisor: CGFloat, viewFrameYDivisor: CGFloat) {
        if let points = points {
            let noseCenter = CGPointMake((points.nose[6].x + points.nose[0].x)/2, (points.nose[6].y + points.nose[0].y)/2)
            
            let noseWidth = widthMultiplier*(points.nose[6].x - points.nose[0].x)
            let noseHeight = (noseView.image!.size.height / noseView.image!.size.width) * noseWidth
            
            noseView.transform = CGAffineTransformIdentity
            
            noseView.frame = CGRectMake(noseCenter.x - noseWidth/viewFrameXDivisor, noseCenter.y - noseHeight/viewFrameYDivisor, noseWidth, noseHeight)
            noseView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: noseView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            noseView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            noseView.hidden = true
        }
    }
    
    func trackBeard(points: FacePoints?, widthMultiplier: CGFloat, viewFrameXDivisor: CGFloat, viewFrameYDivisor: CGFloat) {
        if let points = points {
            let beardCenter = CGPointMake((points.outerMouth[6].x + points.outerMouth[0].x)/2, (points.outerMouth[6].y + points.outerMouth[0].y)/2)
            
            let beardWidth = widthMultiplier*(points.outerMouth[6].x - points.outerMouth[0].x)
            let beardHeight = (beardView.image!.size.height / beardView.image!.size.width) * beardWidth
            
            beardView.transform = CGAffineTransformIdentity
            
            beardView.frame = CGRectMake(beardCenter.x - beardWidth/viewFrameXDivisor, beardCenter.y - beardWidth/viewFrameYDivisor, beardWidth, beardHeight)
            beardView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: beardView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            beardView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            beardView.hidden = true
        }
    }
    
    func trackEyebrows(points: FacePoints?) {
        if let points = points {
            let leftEyebrowCenter = CGPointMake((points.leftBrow[3].x + points.leftBrow[0].x)/2, (points.leftBrow[3].y + points.leftBrow[0].y)/2)
            let rightEyebrowCenter = CGPointMake((points.rightBrow[3].x + points.rightBrow[0].x)/2, (points.rightBrow[3].y + points.rightBrow[0].y)/2)
            
            let leftEyebrowWidth = points.leftBrow[3].x - points.leftBrow[0].x
            let rightEyebrowWidth = points.rightBrow[3].x - points.rightBrow[0].x
            let leftEyebrowHeight = (eyebrowLeftView.image!.size.height / eyebrowLeftView.image!.size.width) * leftEyebrowWidth
            let rightEyebrowHeight = (eyebrowRightView.image!.size.height / eyebrowRightView.image!.size.width) * rightEyebrowWidth
            
            eyebrowLeftView.transform = CGAffineTransformIdentity
            eyebrowRightView.transform = CGAffineTransformIdentity
            
            eyebrowRightView.frame = CGRectMake(rightEyebrowCenter.x - rightEyebrowWidth/2, rightEyebrowCenter.y - rightEyebrowWidth/2.75, rightEyebrowWidth, rightEyebrowHeight)
            eyebrowLeftView.frame = CGRectMake(leftEyebrowCenter.x - leftEyebrowWidth/2, leftEyebrowCenter.y - leftEyebrowWidth/2.75, leftEyebrowWidth, leftEyebrowHeight)
            eyebrowRightView.hidden = false
            eyebrowLeftView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: eyebrowRightView)
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: eyebrowLeftView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            eyebrowRightView.transform = CGAffineTransformMakeRotation(angle)
            eyebrowLeftView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            eyebrowLeftView.hidden = true
            eyebrowRightView.hidden = true
        }
    }
    
    func trackEyeRight(points: FacePoints?, widthMultiplier: CGFloat) {
        if let points = points {
            let eyeCenter = CGPointMake((points.rightEye[0].x + points.rightEye[5].x)/2, (points.rightEye[0].y + points.rightEye[5].y)/2)
            
            let eyeWidth = widthMultiplier*(points.rightEye[5].x - points.rightEye[0].x)
            let eyeHeight = (eyeRightView.image!.size.height / eyeRightView.image!.size.width) * eyeWidth
            
            eyeRightView.transform = CGAffineTransformIdentity
            
            eyeRightView.frame = CGRectMake(eyeCenter.x - eyeWidth/2, eyeCenter.y - eyeHeight/2, eyeWidth, eyeHeight)
            eyeRightView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: eyeRightView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            eyeRightView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            eyeRightView.hidden = true
        }
    }
    
    func trackEyeLeft(points: FacePoints?, widthMultiplier: CGFloat) {
        if let points = points {
            let eyeCenter = CGPointMake((points.leftEye[0].x + points.leftEye[5].x)/2, (points.leftEye[0].y + points.leftEye[5].y)/2)
            
            let eyeWidth = widthMultiplier*(points.leftEye[5].x - points.leftEye[0].x)
            let eyeHeight = (eyeLeftView.image!.size.height / eyeRightView.image!.size.width) * eyeWidth
            
            eyeLeftView.transform = CGAffineTransformIdentity
            
            eyeLeftView.frame = CGRectMake(eyeCenter.x - eyeWidth/2, eyeCenter.y - eyeHeight/2, eyeWidth, eyeHeight)
            eyeLeftView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: eyeLeftView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            eyeLeftView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            eyeLeftView.hidden = true
        }
    }
    
    func trackLips(points: FacePoints?, widthMultiplier: CGFloat) {
        if let points = points {
            let mouthCenter = CGPointMake((points.outerMouth[0].x + points.outerMouth[6].x)/2, (points.outerMouth[0].y + points.outerMouth[6].y)/2)
            
            let mouthWidth = widthMultiplier*(points.outerMouth[6].x - points.outerMouth[0].x)
            let lipsUpperHeight = 0.9*(lipsUpperView.image!.size.height / lipsUpperView.image!.size.width) * mouthWidth
            let lipsLowerHeight = 0.9*(lipsLowerView.image!.size.height / lipsLowerView.image!.size.width) * mouthWidth
            
            lipsUpperView.transform = CGAffineTransformIdentity
            lipsLowerView.transform = CGAffineTransformIdentity
            
            lipsUpperView.frame = CGRectMake(mouthCenter.x - mouthWidth/2, points.outerMouth[3].y - mouthWidth/6, mouthWidth, lipsUpperHeight)
            lipsUpperView.hidden = false
            
            lipsLowerView.frame = CGRectMake(mouthCenter.x - mouthWidth/2, points.outerMouth[9].y - mouthWidth/10, mouthWidth, lipsLowerHeight)
            lipsLowerView.hidden = false
            
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: lipsUpperView)
            self.setAnchorPoint(CGPointMake(0.5, 1.0), forView: lipsLowerView)
            
            let angle = atan2(points.rightEye[5].y - points.leftEye[0].y, points.rightEye[5].x - points.leftEye[0].x)
            lipsUpperView.transform = CGAffineTransformMakeRotation(angle)
            lipsLowerView.transform = CGAffineTransformMakeRotation(angle)
        }
        else {
            lipsUpperView.hidden = true
            lipsLowerView.hidden = true
        }
    }
    
    func setAnchorPoint(anchorPoint: CGPoint, forView view: UIView) {
        var newPoint = CGPointMake(view.bounds.size.width * anchorPoint.x, view.bounds.size.height * anchorPoint.y)
        var oldPoint = CGPointMake(view.bounds.size.width * view.layer.anchorPoint.x, view.bounds.size.height * view.layer.anchorPoint.y)
        
        newPoint = CGPointApplyAffineTransform(newPoint, view.transform)
        oldPoint = CGPointApplyAffineTransform(oldPoint, view.transform)
        
        var position = view.layer.position
        position.x -= oldPoint.x
        position.x += newPoint.x
        
        position.y -= oldPoint.y
        position.y += newPoint.y
        
        view.layer.position = position
        view.layer.anchorPoint = anchorPoint
    }
}