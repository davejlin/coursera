//
//  ViewController.swift
//

import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UITextFieldDelegate {
    @IBOutlet weak var videoTableView: UITableView!
    @IBOutlet weak var searchField: UITextField!
    @IBOutlet weak var waitView: UIView!
    @IBOutlet weak var channelVideoSegmentedControl: UISegmentedControl!
    
    @IBAction func onHelpButtonPressed(sender: AnyObject) {
        performSegueWithIdentifier("idSegueHelp", sender: self)
    }
    
    var selectedVideoIndex: Int!
    var model: Model!
    var channelIndex = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        videoTableView.delegate = self
        videoTableView.dataSource = self
        videoTableView.indicatorStyle = UIScrollViewIndicatorStyle.White
        searchField.delegate = self
        model = Model()
        getChannelDetails(false)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "idSeguePlayer" {
            let playerViewController = segue.destinationViewController as! VideoPlayerViewController
            playerViewController.videoID = model.videosArray[selectedVideoIndex]["videoID"] as! String
        }
    }
    
    @IBAction func changeContent(sender: AnyObject) {
        videoTableView.reloadSections(NSIndexSet(index: 0), withRowAnimation: UITableViewRowAnimation.Fade)
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if channelVideoSegmentedControl.selectedSegmentIndex == 0 {
            return model.channelsDataArray.count
        }
        else {
            return model.videosArray.count
        }
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell: UITableViewCell!
        
        if channelVideoSegmentedControl.selectedSegmentIndex == 0 {
            cell = tableView.dequeueReusableCellWithIdentifier("idCellChannel", forIndexPath: indexPath)
            
            let channelTitleLabel = cell.viewWithTag(10) as! UILabel
            let channelDescriptionLabel = cell.viewWithTag(11) as! UILabel
            let thumbnailImageView = cell.viewWithTag(12) as! UIImageView
            
            let channelDetails = model.channelsDataArray[indexPath.row]
            channelTitleLabel.text = channelDetails["title"] as? String
            channelDescriptionLabel.text = channelDetails["description"] as? String
            
            if let string = channelDetails["thumbnail"] as? String,
                nsURL = NSURL(string: string),
                nsData = NSData(contentsOfURL: nsURL) {
                    thumbnailImageView.image = UIImage(data: nsData)
            }

        }
        else {
            cell = tableView.dequeueReusableCellWithIdentifier("idCellVideo", forIndexPath: indexPath)
            
            let videoTitle = cell.viewWithTag(10) as! UILabel
            let videoThumbnail = cell.viewWithTag(11) as! UIImageView
            
            let videoDetails = model.videosArray[indexPath.row]
            videoTitle.text = videoDetails["title"] as? String
            
            if let string = videoDetails["thumbnail"] as? String,
                nsURL = NSURL(string: string),
                nsData = NSData(contentsOfURL: nsURL) {
                    videoThumbnail.image = UIImage(data: nsData)
            }
        }
        
        return cell
    }
    
    func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return 140.0
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        if channelVideoSegmentedControl.selectedSegmentIndex == 0 {
            channelVideoSegmentedControl.selectedSegmentIndex = 1
            waitView.hidden = false
            model.videosArray.removeAll(keepCapacity: false)
            getVideosForChannelAtIndex(indexPath.row)
        }
        else {
            selectedVideoIndex = indexPath.row
            performSegueWithIdentifier("idSeguePlayer", sender: self)
        }
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        waitView.hidden = false
        let type: String
        if channelVideoSegmentedControl.selectedSegmentIndex == 0 {
            type = "channel"
            model.channelsDataArray.removeAll(keepCapacity: false)
        }else {
            type = "video"
            model.videosArray.removeAll(keepCapacity: false)
        }
        
        var urlString = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=\(model.nResults)&q=\(textField.text)&type=\(type)&key=\(model.apiKey)"
        urlString = urlString.stringByAddingPercentEncodingWithAllowedCharacters(NSCharacterSet.URLQueryAllowedCharacterSet())!
        
        let targetURL = NSURL(string: urlString)
        
        VideoSearcherWebService.performGetRequest(targetURL, completion: {
            [unowned self]
            (data, HTTPStatusCode, error) -> Void in
            if HTTPStatusCode == 200 && error == nil {
                self.processTextFieldShouldReturn(data)
            }
            else {
                print("HTTP Status Code = \(HTTPStatusCode)")
                print("Error while loading channel videos: \(error)")
            }
            self.waitView.hidden = true
        })
        
        return true
    }

    func processTextFieldShouldReturn(data: NSData!) {
        do {
            let resultsDict = try NSJSONSerialization.JSONObjectWithData(data, options: []) as! Dictionary<NSObject, AnyObject>
            let items: Array<Dictionary<NSObject, AnyObject>> = resultsDict["items"] as! Array<Dictionary<NSObject, AnyObject>>
            for var i=0; i<items.count; ++i {
                let snippetDict = items[i]["snippet"] as! Dictionary<NSObject, AnyObject>
                if self.channelVideoSegmentedControl.selectedSegmentIndex == 0 {
                    self.model.channelsArray.append(snippetDict["channelId"] as! String)
                }
                else {
                    var videoDetailsDict = Dictionary<NSObject, AnyObject>()
                    videoDetailsDict["title"] = snippetDict["title"]
                    videoDetailsDict["thumbnail"] = ((snippetDict["thumbnails"] as! Dictionary<NSObject, AnyObject>)["default"] as! Dictionary<NSObject, AnyObject>)["url"]
                    videoDetailsDict["videoID"] = (items[i]["id"] as! Dictionary<NSObject, AnyObject>)["videoId"]
                    self.model.videosArray.append(videoDetailsDict)
                    self.videoTableView.reloadData()
                }
            }
        } catch {
            print(error)
        }
        
        if self.channelVideoSegmentedControl.selectedSegmentIndex == 0 {
            self.getChannelDetails(true)
        }
    }
    
    func getChannelDetails(useChannelIDParam: Bool) {
        var urlString: String!
        
        guard channelIndex < model.channelsArray.count else {
            print("Error: channelIndex exceeds channelsArray count")
            return
        }
        
        if !useChannelIDParam {
            urlString = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&maxResults=\(model.nResults)&forUsername=\(model.channelsArray[channelIndex])&key=\(model.apiKey)"
        }
        else {
            urlString = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&maxResults=\(model.nResults)&id=\(model.channelsArray[channelIndex])&key=\(model.apiKey)"
        }
        
        let targetURL = NSURL(string: urlString)
        
        VideoSearcherWebService.performGetRequest(targetURL, completion: {
            [unowned self] (data, HTTPStatusCode, error) -> Void in
            if HTTPStatusCode == 200 && error == nil {
                self.processGetChannelDetails(data!, useChannelIDParam: useChannelIDParam)
            } else {
                print("HTTP Status Code = \(HTTPStatusCode)")
                print("Error while loading channel details: \(error)")
            }
        })
    }
    
    func processGetChannelDetails(data: NSData!, useChannelIDParam: Bool) {
        do {
            let resultsDict = try NSJSONSerialization.JSONObjectWithData(data, options: []) as! Dictionary<NSObject, AnyObject>
            
            let items: AnyObject! = resultsDict["items"] as AnyObject!
            let firstItemDict = (items as! Array<AnyObject>)[0] as! Dictionary<NSObject, AnyObject>
            let snippetDict = firstItemDict["snippet"] as! Dictionary<NSObject, AnyObject>
            var desiredValuesDict: Dictionary<NSObject, AnyObject> = Dictionary<NSObject, AnyObject>()
            desiredValuesDict["title"] = snippetDict["title"]
            desiredValuesDict["description"] = snippetDict["description"]
            desiredValuesDict["thumbnail"] = ((snippetDict["thumbnails"] as! Dictionary<NSObject, AnyObject>)["default"] as! Dictionary<NSObject, AnyObject>)["url"]
            desiredValuesDict["playlistID"] = ((firstItemDict["contentDetails"] as! Dictionary<NSObject, AnyObject>)["relatedPlaylists"] as! Dictionary<NSObject, AnyObject>)["uploads"]
            model.channelsDataArray.append(desiredValuesDict)
            videoTableView.reloadData()
            ++channelIndex
            if channelIndex < model.channelsArray.count {
                getChannelDetails(useChannelIDParam)
            }
            else {
                waitView.hidden = true
            }
        } catch {
            print(error)
        }
    }
    
    func getVideosForChannelAtIndex(index: Int!) {
        let playlistID = model.channelsDataArray[index]["playlistID"] as! String
        let urlString = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=\(model.nResults)&playlistId=\(playlistID)&key=\(model.apiKey)"
        let targetURL = NSURL(string: urlString)
        VideoSearcherWebService.performGetRequest(targetURL, completion: { [unowned self]
            (data, HTTPStatusCode, error) -> Void in
            if HTTPStatusCode == 200 && error == nil {
                self.processVideoForChannel(data!)
            }
            else {
                print("HTTP Status Code = \(HTTPStatusCode)")
                print("Error while loading channel videos: \(error)")
            }
            self.waitView.hidden = true
            })
    }
    
    func processVideoForChannel(data: NSData!) {
        do {
            let resultsDict = try NSJSONSerialization.JSONObjectWithData(data, options: []) as! Dictionary<NSObject, AnyObject>
            let items: Array<Dictionary<NSObject, AnyObject>> = resultsDict["items"] as! Array<Dictionary<NSObject, AnyObject>>
            for var i=0; i<items.count; ++i {
                let playlistSnippetDict = (items[i] as Dictionary<NSObject, AnyObject>)["snippet"] as! Dictionary<NSObject, AnyObject>
                var desiredPlaylistItemDataDict = Dictionary<NSObject, AnyObject>()
                desiredPlaylistItemDataDict["title"] = playlistSnippetDict["title"]
                desiredPlaylistItemDataDict["thumbnail"] = ((playlistSnippetDict["thumbnails"] as! Dictionary<NSObject, AnyObject>)["default"] as! Dictionary<NSObject, AnyObject>)["url"]
                desiredPlaylistItemDataDict["videoID"] = (playlistSnippetDict["resourceId"] as! Dictionary<NSObject, AnyObject>)["videoId"]
                model.videosArray.append(desiredPlaylistItemDataDict)
                videoTableView.reloadData()
            }
        } catch {
            print(error)
        }
    }
}

