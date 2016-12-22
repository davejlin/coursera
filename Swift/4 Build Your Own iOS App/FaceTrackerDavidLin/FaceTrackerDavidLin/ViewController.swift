//
//  ViewController.swift
//  FaceTrackerDavidLin
//
//  Created by Lin David, US-205 on 4/12/16.
//  Copyright © 2016 Lin David. All rights reserved.
//

import UIKit
import FaceTracker

class ViewController: UIViewController, FaceTrackerViewControllerDelegate {
    
    var selectedStyleIndex = 0
    let hatImageName = ["hat_santa","hat_pirate","hair_lady","helmet_robot_2"]
    let noseImageName = ["nose_santa","parrot","rose","nose_robot"]
    let beardImageName = ["beard_santa","beard_pirate","transparent","face_robot"]
    let eyebrowRightImageName = ["eyebrow_santa_right","transparent","eyebrow_lady_right","transparent"]
    let eyebrowLeftImageName = ["eyebrow_santa_left","transparent","eyebrow_lady_left","transparent"]
    let eyeRightImageName = ["transparent","eye_pirate_right","eye_lady_right","eye_robot_right"]
    let eyeLeftImageName = ["transparent","transparent","eye_lady_left","eye_robot_left"]
    let lipsUpperImageName = ["transparent","transparent","lips_lady_upper","transparent"]
    let lipsLowerImageName = ["transparent","transparent","lips_lady_lower","transparent"]
    
    let hatWidth:[CGFloat] = [5, 6, 7.5, 5]
    let hatViewFrameXDivisor:[CGFloat] = [2.5, 2, 2, 2]
    let hatViewFrameYMultiplier:[CGFloat] = [1.25, 1.1, 0.35, 1.25]
    
    let noseWidth:[CGFloat] = [1.5, 3, 1.5, 1]
    let noseViewFrameXDivisor:[CGFloat] = [2, -2, -1.5, 2]
    let noseViewFrameYDivisor:[CGFloat] = [2, -2, 1, 4]
    
    let beardWidth:[CGFloat] = [5, 3.2, 1, 3.5]
    let beardViewFrameXDivisor:[CGFloat] = [2.2, 1.95, 1, 2]
    let beardViewFrameYDivisor:[CGFloat] = [2.1, 2.5, 1, 9]
    
    let eyeRightWidth:[CGFloat] = [1, 2, 2, 1.75]
    let eyeLeftWidth:[CGFloat] = [1, 1, 2, 1.75]

    let lipsWidth:[CGFloat] = [1, 1, 1.5, 1]
    
    var pointsDraw = PointsDraw()
    weak var faceTrackerViewController: FaceTrackerViewController?
    
    @IBOutlet var faceTrackerContainerView: UIView!
    
    @IBAction func onSantaButton(sender: AnyObject) {
        selectedStyleIndex = 0
        initImages()
    }

    @IBAction func onPirateButton(sender: AnyObject) {
        selectedStyleIndex = 1
        initImages()
    }
    
    @IBAction func onLadyButton(sender: AnyObject) {
        selectedStyleIndex = 2
        initImages()
    }
    
    @IBAction func onRobotButton(sender: AnyObject) {
        selectedStyleIndex = 3
        initImages()
    }
    
    var overlayViews = [String: [UIView]]()
    var pointViews = [UIView]()
    var hatView = UIImageView()
    var noseView = UIImageView()
    var beardView = UIImageView()
    var eyebrowRightView = UIImageView()
    var eyebrowLeftView = UIImageView()
    var eyeRightView = UIImageView()
    var eyeLeftView = UIImageView()
    var lipsUpperView = UIImageView()
    var lipsLowerView = UIImageView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        initViews()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "faceTrackerEmbed") {
            faceTrackerViewController = segue.destinationViewController as? FaceTrackerViewController
            faceTrackerViewController!.delegate = self
        }
    }
    
    override func viewDidAppear(animated: Bool) {
        faceTrackerViewController!.startTracking{() -> Void in
        }
    }
    
    func faceTrackerDidUpdate(points: FacePoints?) {
        //pointsDraw.trackFacialPoints(points)
        placeFacialFeatures(points)
    }
    
    func placeFacialFeatures(points: FacePoints?) {
        pointsDraw.trackHat(points, widthMultiplier: hatWidth[selectedStyleIndex], viewFrameXDivisor: hatViewFrameXDivisor[selectedStyleIndex], viewFrameYMultiplier: hatViewFrameYMultiplier[selectedStyleIndex])
        pointsDraw.trackNose(points, widthMultiplier: noseWidth[selectedStyleIndex], viewFrameXDivisor: noseViewFrameXDivisor[selectedStyleIndex], viewFrameYDivisor: noseViewFrameYDivisor[selectedStyleIndex])
        pointsDraw.trackBeard(points, widthMultiplier: beardWidth[selectedStyleIndex], viewFrameXDivisor: beardViewFrameXDivisor[selectedStyleIndex], viewFrameYDivisor: beardViewFrameYDivisor[selectedStyleIndex])
        pointsDraw.trackEyebrows(points)
        pointsDraw.trackEyeRight(points, widthMultiplier: eyeRightWidth[selectedStyleIndex])
        pointsDraw.trackEyeLeft(points, widthMultiplier: eyeLeftWidth[selectedStyleIndex])
        pointsDraw.trackLips(points, widthMultiplier: lipsWidth[selectedStyleIndex])
    }
    
    func initViews() {
        insertSubviews()
        initImages()
    }
    
    func insertSubviews() {
        self.view.insertSubview(noseView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(hatView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(beardView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(eyebrowRightView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(eyebrowLeftView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(eyeRightView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(eyeLeftView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(lipsUpperView, aboveSubview: faceTrackerContainerView)
        self.view.insertSubview(lipsLowerView, aboveSubview: faceTrackerContainerView)
    }
    
    func initImages() {
        hatView.image = UIImage(named: hatImageName[selectedStyleIndex])
        noseView.image = UIImage(named: noseImageName[selectedStyleIndex])
        beardView.image = UIImage(named: beardImageName[selectedStyleIndex])
        eyebrowRightView.image = UIImage(named: eyebrowRightImageName[selectedStyleIndex])
        eyebrowLeftView.image = UIImage(named: eyebrowLeftImageName[selectedStyleIndex])
        eyeRightView.image = UIImage(named: eyeRightImageName[selectedStyleIndex])
        eyeLeftView.image = UIImage(named: eyeLeftImageName[selectedStyleIndex])
        lipsUpperView.image = UIImage(named: lipsUpperImageName[selectedStyleIndex])
        lipsLowerView.image = UIImage(named: lipsLowerImageName[selectedStyleIndex])
        
        pointsDraw.setViews(self.view, overlayViews: overlayViews, pointViews: pointViews, hatView: hatView, noseView: noseView, beardView: beardView, eyebrowRightView: eyebrowRightView, eyebrowLeftView: eyebrowLeftView, eyeRightView:eyeRightView, eyeLeftView:eyeLeftView, lipsUpperView:lipsUpperView, lipsLowerView:lipsLowerView)
    }

}

