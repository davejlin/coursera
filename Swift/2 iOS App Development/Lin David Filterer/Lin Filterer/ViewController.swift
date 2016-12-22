//
//  ViewController.swift
//  Filterer
//
//  Created by Jack on 2015-09-22.
//  Copyright © 2015 UofT. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {

    var filteredImage: UIImage?
    var originalImage: UIImage?
    
    @IBOutlet var mainImageView: UIImageView!

    @IBOutlet var sliderView: UIView!
    @IBOutlet var secondaryMenu: UIView!
    @IBOutlet var secondaryMenuCollectionView: SecondaryMenuCollectionView!
    @IBOutlet var secondaryMenuCollectionViewFlowLayout: UICollectionViewFlowLayout!
    @IBOutlet var bottomMenu: UIView!
    
    @IBOutlet var filterButton: UIButton!
    @IBOutlet var originalLabel: UILabel!
    
    var rgbConfig = [false, false, false, false]
    
    let menuFilterImages = [UIImage(named: "red"), UIImage(named: "green"), UIImage(named: "blue"), UIImage(named:"yellow"), UIImage(named:"purple"), UIImage(named:"bw")]

    override func viewDidLoad() {
        super.viewDidLoad()
        
        secondaryMenuCollectionView.delegate = self
        secondaryMenuCollectionView.dataSource = self
        
        initSubMenu(secondaryMenuCollectionView)
        initSubMenu(sliderView)
        compareButton.enabled = false
        editButton.enabled = false
        originalImage = mainImageView.image
        filteredImage = originalImage
        originalLabel.hidden = false
    }
    
    override func viewWillLayoutSubviews() {
        secondaryMenuCollectionView.collectionViewLayout.invalidateLayout()
    }
    
    // MARK: Slider Control
    @IBOutlet var sliderControl: UISlider!
    @IBAction func onSliderControlValueChanged(sender: UISlider) {
        applyFilterWithModifiers(1, ceilingModifier: Double(sender.value))
    }
    
    // MARK: Edit Button
    @IBOutlet var editButton: UIButton!
    @IBAction func onEditButton(sender: UIButton) {
        if sender.selected {
            hideSubMenu(sliderView)
            showSubMenu(secondaryMenuCollectionView)
            sender.selected = false
        } else {
            hideSubMenu(secondaryMenuCollectionView)
            showSubMenu(sliderView)
            sender.selected = true
        }
    }
    
    // MARK: Compare Button
    @IBOutlet var compareButton: UIButton!
    @IBAction func onCompareButton(sender: UIButton?) {
        toggleImage()
    }
    
    // MARK: Green Filter Button
    @IBOutlet var greenFilterButton: UIButton!
    @IBAction func onGreenFilterButton(sender: UIButton?) {
        applyFilterWithColors(red: false, green: true, blue: false)
    }
    
    // MARK: Blue Filter Button
    @IBOutlet var blueFilterButton: UIButton!
    @IBAction func onBlueFilterButton(sender: UIButton?) {
        applyFilterWithColors(red: false, green: false, blue: true)
    }
    
    // MARK: Yellow Filter Button
    @IBOutlet var yellowFilterButton: UIButton!
    @IBAction func onYellowFilterButton(sender: UIButton?) {
        applyFilterWithColors(red: true, green: true, blue: false)
    }
    
    // MARK: Purple Filter Button
    @IBOutlet var purpleFilterButton: UIButton!
    @IBAction func onPurpleFilterButton(sender: UIButton?) {
        applyFilterWithColors(red: true, green: false, blue: true)
    }
    
    // MARK: Red Filter Button
    @IBOutlet var redFilterButton: UIButton!
    @IBAction func onRedFilterButton(sender: UIButton?) {
        applyFilterWithColors(red: true, green: false, blue: false)
    }
    
    func onBWFilterButton() {
        applyFilterWithColors(red: true, green: true, blue: true, bw: true)
    }
    
    func applyFilterWithColors(red red: Bool, green: Bool, blue: Bool, bw: Bool=false) {
        rgbConfig = [red, green, blue, bw]
        sliderControl.value = 2
        applyFilterWithModifiers(1, ceilingModifier: 2)
    }
    
    func applyFilterWithModifiers(floorModifier: Double, ceilingModifier: Double) {
        compareButton.enabled = true
        editButton.enabled = true
        
        do {
            filteredImage = try self.createFilteredImage(floorModifier, ceilingMoifier: ceilingModifier)
            self.showFilteredImageView(filteredImage)
        } catch let error {
            NSLog("RGBAImage Exception: \(error)")
        }
    }
    
    func showFilteredImageView(image: UIImage?) {
        guard let nextImage = image else { return }
        fadeInImage(nextImage, completion: {
            completed in
            if (completed) {
                self.originalLabel.hidden = true
            }
        })
    }
    
    func showOriginalImageView() {
        guard let nextImage = originalImage else { return }
        fadeInImage(nextImage, completion: {
            completed in
            if (completed) {
                self.originalLabel.hidden = false
            }
        })
    }
    
    func fadeInImage(image: UIImage, completion: (Bool -> Void)) {
        UIView.transitionWithView(
            mainImageView,
            duration: 0.7,
            options: UIViewAnimationOptions.TransitionCrossDissolve,
            animations: {
                [unowned self] in
                self.mainImageView.image = image
            },
            completion: completion)
    }
    
    // MARK: Image View Tap Toggle
    
    @IBAction func downImageViewButton(sender: UIButton) {
        toggleImage()
    }
    
    @IBAction func upImageViewButton(sender: UIButton) {
        toggleImage()
    }

    func toggleImage() {
        if originalImage == filteredImage { return }
        
        if mainImageView.image == originalImage {
            showFilteredImageView(filteredImage)
        } else {
            showOriginalImageView()
        }
    }
    
    // MARK: Share
    @IBAction func onShare(sender: AnyObject) {
        let activityController = UIActivityViewController(activityItems: ["Check out our really cool app", mainImageView.image!], applicationActivities: nil)
        
        presentViewController(activityController, animated: true, completion: nil)
    }
    
    // MARK: New Photo
    @IBAction func onNewPhoto(sender: AnyObject) {
        let actionSheet = UIAlertController(title: "New Photo", message: nil, preferredStyle: .ActionSheet)
        
        actionSheet.addAction(UIAlertAction(title: "Camera", style: .Default, handler: { action in
            self.showCamera()
        }))
        
        actionSheet.addAction(UIAlertAction(title: "Album", style: .Default, handler: { action in
            self.showAlbum()
        }))
        
        actionSheet.addAction(UIAlertAction(title: "Cancel", style: .Cancel, handler: nil))
        
        self.presentViewController(actionSheet, animated: true, completion: nil)
    }
    
    func showCamera() {
        guard UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.Camera) else {
            
            let alertController = UIAlertController(title: "Lin Filterer", message:
                "No Camera Available", preferredStyle: UIAlertControllerStyle.Alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.Default,handler: nil))
            
            self.presentViewController(alertController, animated: true, completion: nil)
            
            return }
        
        let cameraPicker = UIImagePickerController()
        cameraPicker.delegate = self
        cameraPicker.sourceType = .Camera
        
        presentViewController(cameraPicker, animated: true, completion: nil)
    }
    
    func showAlbum() {
        let cameraPicker = UIImagePickerController()
        cameraPicker.delegate = self
        cameraPicker.sourceType = .PhotoLibrary
        
        presentViewController(cameraPicker, animated: true, completion: nil)
    }
    
    // MARK: UIImagePickerControllerDelegate
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject]) {
        dismissViewControllerAnimated(true, completion: nil)
        if let image = info[UIImagePickerControllerOriginalImage] as? UIImage {
            resetMenusAndImages()
            originalImage = image
            mainImageView.image = image
        }
    }
    
    func imagePickerControllerDidCancel(picker: UIImagePickerController) {
        dismissViewControllerAnimated(true, completion: nil)
    }
    
    func resetMenusAndImages() {
        hideSubMenu(secondaryMenuCollectionView)
        hideSubMenu(sliderView)
        filterButton.selected = false
        compareButton.enabled = false
        editButton.enabled = false
        editButton.selected = false

        filteredImage = originalImage
        showOriginalImageView()
    }
    
    // MARK: Filter Menu
    @IBAction func onFilter(sender: UIButton) {
        if (sender.selected) {
            resetMenusAndImages()
        } else {
            showSubMenu(secondaryMenuCollectionView)
            sender.selected = true
        }
    }
    
    func initSubMenu(subMenu: UIView) {
        subMenu.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.90)
        subMenu.translatesAutoresizingMaskIntoConstraints = false
    }
    
    func showSubMenu(subMenu: UIView) {
        view.addSubview(subMenu)
        
        let bottomConstraint = subMenu.bottomAnchor.constraintEqualToAnchor(bottomMenu.topAnchor)
        let leftConstraint = subMenu.leftAnchor.constraintEqualToAnchor(view.leftAnchor)
        let rightConstraint = subMenu.rightAnchor.constraintEqualToAnchor(view.rightAnchor)
        
        let heightConstraint = subMenu.heightAnchor.constraintEqualToConstant(44)
        
        NSLayoutConstraint.activateConstraints([bottomConstraint, leftConstraint, rightConstraint, heightConstraint])
        
        view.layoutIfNeeded()
        
        subMenu.alpha = 0
        UIView.animateWithDuration(0.4) {
            subMenu.alpha = 1.0
        }
    }
    
    func hideSubMenu(subMenu: UIView) {
        UIView.animateWithDuration(0.4, animations: {
            subMenu.alpha = 0
            }) { completed in
                if completed == true {
                    subMenu.removeFromSuperview()
                }
        }
    }
    
    enum RGBAImageError: ErrorType {
        case ErrorWithMessage(message: String)
    }
    
    func createFilteredImage(floorModifier: Double, ceilingMoifier: Double) throws -> UIImage? {
        let image = originalImage
        if !rgbConfig[0] && !rgbConfig[1] && !rgbConfig[2] {
            return  image
        }
        
        guard let rgbaImage = RGBAImage(image: image!) else {
            throw RGBAImageError.ErrorWithMessage(message: "RGBAImage could not be created")
        }
        
        let filter = RGBAImageFilter(newAlphaValue: 255, changeRed: rgbConfig[0], changeGreen: rgbConfig[1], changeBlue: rgbConfig[2], floorModifier: floorModifier, ceilingModifier: ceilingMoifier, makeBlackAndWhite: rgbConfig[3])
        let filterPipeline = [filter]
        return RGBAImageProcessor().processRGBAImageWithFilters(rgbaImage: rgbaImage, filterPipeline: filterPipeline).toUIImage()
    }
    
    func useFilter(item: Int) {
        switch (item) {
        case 0:
            onRedFilterButton(nil)
        case 1:
            onGreenFilterButton(nil)
        case 2:
            onBlueFilterButton(nil)
        case 3:
            onYellowFilterButton(nil)
        case 4:
            onPurpleFilterButton(nil)
        case 5:
            onBWFilterButton()
        default:
            break
        }
    }
    
    // MARK: UICollectionView Protocols
    func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        return 1;
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 6;
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell{
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("Filter Cell", forIndexPath: indexPath) as! FilterCollectionViewCell
        cell.filterImageView.image = menuFilterImages[indexPath.item]
        return cell
    }
    
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        useFilter(indexPath.item)
    }
    
    func collectionView(collectionView: UICollectionView, didDeselectItemAtIndexPath indexPath: NSIndexPath) {
    }

    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAtIndexPath indexPath: NSIndexPath) -> CGSize {
        return CGSize(width: 90, height: 44)
    }
    
    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAtIndex section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: 0.0, left: 0.0, bottom: 0.0, right: 0.0)
    }
}

