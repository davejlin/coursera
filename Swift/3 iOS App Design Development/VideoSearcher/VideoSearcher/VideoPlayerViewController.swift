//
//  VideoPlayerViewController.swift
//

import UIKit

class VideoPlayerViewController: UIViewController {

    @IBOutlet weak var playerView: YTPlayerView!
    
    var videoID: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        playerView.loadWithVideoId(videoID)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

}
