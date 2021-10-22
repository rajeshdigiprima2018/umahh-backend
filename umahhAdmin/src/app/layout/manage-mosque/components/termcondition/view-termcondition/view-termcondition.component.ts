import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Location,PlatformLocation } from '@angular/common';
import { LocalStorageService } from 'ngx-webstorage/dist/services/localStorage';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { appConfig } from '../../../../../core/app.config';
import { VideoProcessingService } from '../../../services/video-processing.service';

@Component({
  selector: 'app-view-termcondition',
  templateUrl: './view-termcondition.component.html',
  styleUrls: ['./view-termcondition.component.scss']
})
export class ViewTermconditionComponent implements OnInit,OnDestroy {
  videoDetails = new Array;
  plainText: any
  videourl: any
  contentTitle: string;
  contentDescription: string;
  contentId: any;
  likeCommentShare: any;
  videos = [];
  comments = [];
  historylist = [];
  displayDelete: boolean = false;
  id: any;
  like: boolean;
  totalCount: number = 0;// taking from response dynamic
  count: number = 5;//data to show on table
  page: number = 1;//page of table
  pageCountLink: any; //total count/count;
  desLength: any;
  views: any;
  likecount: any;
  increasedLikecount: number = 0;
  commentcount: any;
  replycomment: boolean = true;
  commentId: string = '';
  loggedInUserDetails: any = '';
  addCommentForm: FormGroup;
  addCommentReplyForm: FormGroup;
  imageurl: string = environment.backendBaseUrl;
  baseurl: string = environment.baseUrl;
  contentType: string;
  shareDisplay: boolean = true;
  displayShareButton: boolean = false;
  isLoading: boolean = false;
  isHistory: boolean = false;
  historyId: any;
  embeded: boolean = false;
  embedurl: string = appConfig.youtube.EMBED;
  adUrl: any = null;
  // displayVideo : boolean = true; 
  displayAd: boolean = true;
  videoEnded: any;
  videoToPlay: any
  skipAdStatus: boolean;
  videoTimeForSecondAd: any;
  videoTimeForThirdAd: any;
  videoToPlayAfter3Ad: any;
  pauseVideoStatus: boolean = false;
  videoAfterAd: boolean = false;
  adsArray: any[] = [];
  preAdTime: any;
  midAdTime: any;
  postAdTime: any;
  currentTime: any = 0;

  public thumbnailImage: any;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private manageMosque: ManageMosqueService,
    private sanitizer: DomSanitizer,
    private _location: Location,
    private localSt: LocalStorageService,
    private formBuilder: FormBuilder,
    private videoService: VideoProcessingService,
    location: PlatformLocation

  ) {
    location.onPopState(() => {
      this.suspendVideo();
  });
    this.sanitizer = sanitizer;
    this.route.params.subscribe(params => {
      this.contentId = params['id'];
      this.historyId = this.contentId;
      this.loggedInUserDetails = this.localSt.retrieve('all');
      this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    
      this.searchWithListing();
      this.getlistLikeCommentShare();
      this.addToHistory(this.historyId);
      this.currentTime = 0;
    });

  }

  ngOnInit() {
    this.currentTime = 0;
    this.route.params.subscribe(params => {
      this.contentId = params['id'];
    });
    //For Adding Comment Formcontrol
    this.addCommentForm = this.formBuilder.group({
      addcomment: ['', [Validators.required]],
    });
    //For Adding Comment Reply Formcontrol
    this.addCommentReplyForm = this.formBuilder.group({
      addcommentreply: new FormControl(''),
    });
    this.getContentVideoById();

  }

  suspendVideo(){
    this.videoToPlay.onsuspend;
  }

  pauseVideo() {
    this.videoToPlay.pause();
    this.currentTime = this.videoToPlay.currentTime;
    this.pauseVideoStatus = true
  }

  playVideo() {
    this.pauseVideoStatus = false;
    this.videoToPlay.currentTime = parseFloat(this.currentTime);
    this.videoToPlay.play();
  }

  seekingVideo() {
    this.currentTime = this.videoToPlay.currentTime;
  }
  onAdEnded() {
    this.displayAd = !this.displayAd
    this.playVideo();
  }
  curVideo() {
    if (this.adsArray) {
      this.videoToPlay = document.getElementById("videoToPlay1");
      this.manageAd(this.adsArray);
    }
  }

  compareValues(key, order='asc') {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || 
         !b.hasOwnProperty(key)) {
        return 0; 
      }
      
      const varA = (typeof a[key] === 'string') ? 
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? 
        b[key].toUpperCase() : b[key];
        
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? 
        (comparison * -1) : comparison
      );
    };
  }

  manageAd(arr) {
    if (arr) {
      let tempArr = [];
      arr.filter(function (item, i) {
        if (arr.length > 1) {
            if ((item.pre == true) && (item.mid == false) && (item.post == false)) {
              item.tag = 'A';
              tempArr.push(item);
              
            }
            else if ((item.pre == false) && (item.mid == true) && (item.post == false)) {
              item.tag = 'B';
              tempArr.push(item);
              
            }
            else if ((item.pre == false) && (item.mid == false) && (item.post == true)) {
              item.tag = 'C';
              tempArr.push(item);
              
            }
        }
        else {
          tempArr.push(item);
        }
      });
      tempArr.sort(this.compareValues('tag'));
      this.adsArray = tempArr;

      if (this.adsArray && this.adsArray.length > 0) {
       
        let i = 0;
        if (this.adsArray[i].pre == true) {
          this.preAdTime = this.adsArray[i].selectedTime;
          this.adUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.imageurl}/uploads/Ads/` + this.adsArray[i].adsUrl);
          let currPlayTime = setInterval(() => {
            this.videoToPlay.ontimeupdate = this.getVideoCurTime();
            if (this.videoToPlay.currentTime >= this.preAdTime) {
              this.currentTime = this.videoToPlay.currentTime;
              this.pauseVideo();
              this.displayAd = true;
              this.adsArray.splice(i, 1);
             
              clearInterval(currPlayTime);
            }
          }, 800)
        } else if (this.adsArray[i].mid == true) {
          this.midAdTime = this.adsArray[i].selectedTime;
          this.adUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.imageurl}/uploads/Ads/` + this.adsArray[i].adsUrl);
          let currPlayTime = setInterval(() => {
            this.videoToPlay.ontimeupdate = this.getVideoCurTime();
            if (this.videoToPlay.currentTime >= this.midAdTime) {
              this.currentTime = this.videoToPlay.currentTime;
              this.pauseVideo();
              this.displayAd = true;
              this.adsArray.splice(i, 1);
              
              clearInterval(currPlayTime);
            }
          }, 800)
        } else if (this.adsArray[i].post == true) {
          this.postAdTime = this.adsArray[i].selectedTime;
          this.adUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.imageurl}/uploads/Ads/` + this.adsArray[i].adsUrl);
          let currPlayTime = setInterval(() => {
            this.videoToPlay.ontimeupdate = this.getVideoCurTime();
            if (this.videoToPlay.currentTime >= this.postAdTime) {
              this.currentTime = this.videoToPlay.currentTime;
              this.pauseVideo();
              this.displayAd = true;
              this.adsArray.splice(i, 1);
              
              clearInterval(currPlayTime);
            }
          }, 800)
        }
        
      }
    }

  }


  setInterValSetup(arr, vplay) {
    let i = 0;
    let len = arr.length;
    let tempTime;
    for (i; i < len - 1; i++) {
      let currPlayTime = setInterval(() => {
        this.videoToPlay = vplay;
        this.videoToPlay.ontimeupdate = this.getVideoCurTime();
        if (arr[i]) {
          tempTime = Object.keys(arr[i])[0]
          if (this.videoToPlay.currentTime >= tempTime) {
            this.videoToPlay.pause();
            this.displayAd = true;
            clearInterval(currPlayTime);
          }
        }


      }, tempTime)
    }
  }
  getVideoCurTime() {
   
    this.videoToPlay.currentTime
  }

  adAfterVideo(value) {
    this.videoToPlay.currentTime = value
  }

  addToHistory(id) {
    let data = {
      content_id: id,
      user_id: this.loggedInUserDetails._id
    }
    this.manageMosque.addtoHistory(data).subscribe(res => {
      if (res && res.code == 200 && res.data) {
      }
    })
  }

  listHistory() {
    let data = {
      user_id: this.loggedInUserDetails._id
    }
    this.manageMosque.listHistory(data).subscribe(res => {
      if (res && res.code == 200 && res.data) {
        this.historylist = res.data
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].content_id.isEmbedded) {
            this.historylist[i].thumbnail = `https://img.youtube.com/vi/${res.data[i].content_id.contentUrl}/default.jpg`
          }
          else {
            this.historylist[i].thumbnail =  res.data[i].content_id.thumbUrl ? `${this.imageurl}/uploads/healthVideos/thumbnailImages/` + res.data[i].content_id.thumbUrl : `../assets/images/slider_th4.png`;
          }
        }

      }
    })
  }
  
  getlistLikeCommentShare() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.contentId = params['id'];
    });

    let data = {
      content_id: this.contentId,
      user_id: this.loggedInUserDetails._id
    }
    this.manageMosque.listContentLikeCommentShare(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code == 200 && res.data) {
        this.likeCommentShare = res.data;
        this.like = res.data.likestatus;
        this.likecount = this.likeCommentShare.likeCount ? this.likeCommentShare.likeCount : 0;
        this.commentcount = this.likeCommentShare.commentCount ? this.likeCommentShare.commentCount : 0;
        this.comments = this.likeCommentShare.contentComment;
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  changeMode(str) {
    if (str == 'watchnext') {
      this.isHistory = false
    }
    else {
      this.isHistory = true;
      this.listHistory();
    }
  }

  skipAd() {
    this.displayAd = !this.displayAd;
    
  }

  

  getContentVideoById() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.manageMosque.getContentById(params['id']).subscribe((res: any) => {
        this.isLoading = false;
        if (res.code == 200) {
          this.views = res.data.data.viewCounts;
          this.contentTitle = res.data.data.contentTitle;
          this.contentDescription = res.data.data.contentDescription

          if (res.data.mangeAdsResult) {
            this.adsArray = res.data.mangeAdsResult
          }
         

          if (res.data.data.isEmbedded == true) {
            this.embeded = true
           
            if (res.data.mangeAdsResult && (res.data.mangeAdsResult.isDeleted == false)) {
              this.displayAd = true;
            }
            else {
              this.displayAd = false;
            }
            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedurl + res.data.data.contentUrl + '?rel=0');
          }
          else {
            this.embeded = false
            if (res.data.mangeAdsResult && (res.data.mangeAdsResult.isDeleted == false)) {
              this.displayAd = true;
            }
            else {
              this.displayAd = false;
            }
            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.imageurl}/uploads/healthVideos/` + res.data.data.contentUrl);
          }
          this.videoDetails.push(res.data.data);
          for (let i = 0; i < this.videoDetails.length; i++) {
            this.videoDetails[i].contentDescription = this.videoDetails[i].contentDescription.replace(/<[^>]*>/g, '');
          }
        } else {
          this.toastr.error(res.message);
        }
      })
    })
  }

  //On Play of the video


  navigate() {
    this.suspendVideo();
    this._location.back();
  }

  showShare(value) {
    if (value == true) {
      this.shareDisplay = false;
      this.displayShareButton = true;
    }
    else if (value == false) {
      this.shareDisplay = true;
      this.displayShareButton = false;
    }

  }
  searchWithListing() {
    this.isLoading = true;
    let data = {
      count: this.count,
      page: this.page,
      searchText: '',
      contentType: 'video',
      userType: this.loggedInUserDetails.userType,
      userid: this.loggedInUserDetails._id,
      parent_id: ''
    }
    if (this.loggedInUserDetails.userType == appConfig.userType.CLINIC) {
      data.parent_id = this.loggedInUserDetails.created_by_id;
    }
    else if (this.loggedInUserDetails.userType == appConfig.userType.STAFF) {
      //static for only associated with one clinic
      data.parent_id = this.loggedInUserDetails.associated_clinic_detail[0].clinic_id;
    }
    else if (this.loggedInUserDetails.userType == appConfig.userType.USER) {
      data.parent_id = this.loggedInUserDetails.associated_clinic_detail[0].clinic_id;
    }
    else {
      data.parent_id = null;
    }

    if (this.loggedInUserDetails.userType == appConfig.userType.USER) {
      this.manageMosque.listHealthContent(data).subscribe(res => {
        this.isLoading = false;
        if (res && res.code == 200 && res.data) {
          this.videos = [];
          let tempTopics = res.data;
          tempTopics = res.data;
          this.totalCount = res.totalCount;
          this.pageCountLink = (this.totalCount / this.count);
          this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
          this.pageCountLink = parseInt(this.pageCountLink);
          for (var i = 0; i < this.count; i++) {
            if (tempTopics && tempTopics[i] && tempTopics[i].contentDescription) {
              tempTopics[i].contentDescription = tempTopics[i].contentDescription.replace(/<[^>]*>/g, '');
              if (tempTopics[i].contentDescription.length > 110) {
                tempTopics[i].display = true
              } else {
                tempTopics[i].display = false
              }
              if (tempTopics[i].isEmbedded) {
                tempTopics[i].thumbnail = `https://img.youtube.com/vi/${tempTopics[i].contentUrl}/default.jpg`
              }
              else {
               
                tempTopics[i].thumbnail =  tempTopics[i].thumbUrl ? `${this.imageurl}/uploads/healthVideos/thumbnailImages/` +  tempTopics[i].thumbUrl : `../assets/images/slider_th4.png`;
                

              }
              this.videos.push(tempTopics[i])
            }
          }
        } else {
          this.toastr.error(res.message);
        }
      })
    }
    else {

      this.manageMosque.listContent(data).subscribe(res => {
        this.isLoading = false;
        if (res && res.code == 200 && res.data) {
          this.videos = [];
          let tempTopics = res.data;
          tempTopics = res.data;
          this.totalCount = res.totalCount;
          this.pageCountLink = (this.totalCount / this.count);
          this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
          this.pageCountLink = parseInt(this.pageCountLink);
          for (var i = 0; i < this.count; i++) {
            if (tempTopics && tempTopics[i] && tempTopics[i].contentDescription) {
              tempTopics[i].contentDescription = tempTopics[i].contentDescription.replace(/<[^>]*>/g, '');
              if (tempTopics[i].contentDescription.length > 110) {
                tempTopics[i].display = true
              } else {
                tempTopics[i].display = false
              }
              if (tempTopics[i].isEmbedded) {
                tempTopics[i].thumbnail = `https://img.youtube.com/vi/${tempTopics[i].contentUrl}/default.jpg`
              }
              else {
                
                tempTopics[i].thumbnail =  tempTopics[i].thumbUrl ? `${this.imageurl}/uploads/healthVideos/thumbnailImages/` + tempTopics[i].thumbUrl : `../assets/images/slider_th4.png`;

              }
              this.videos.push(tempTopics[i])
            }
          }
        } else {
          this.toastr.error(res.message);
        }
      })
    }


  }
  getStringCount(description) {
    if (description.length > 25) {
      return true
    } else {
      return false
    }
  }

  paginate(event) {
    this.page = event.page + 1;
    this.searchWithListing();
  }
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  increaseView() {
  }
  increaseLike(like) {
    this.isLoading = true;
    like = !like;
    if (like) {
     
      let data = {
        like: like,
        user_id: this.loggedInUserDetails._id,
        content_id: this.contentId
      }
      this.manageMosque.addContentLikeCommentShare(data).subscribe(res => {
        this.isLoading = false;
        if (res && res.code == 200 && res.data) {
          this.like = res.data.likeData.likeType;
          this.increasedLikecount = this.likecount;
          this.likecount = this.likecount + 1;
        }
        else {
          this.toastr.error(res.message);
        }
      })
    }
    else {
      if (this.likecount != 0 || this.likecount != '0') {
        let data = {
          like: like,
          user_id: this.loggedInUserDetails._id,
          content_id: this.contentId
        }
        this.manageMosque.addContentLikeCommentShare(data).subscribe(res => {
          this.isLoading = false;
          if (res && res.code == 200 && res.data) {
            this.like = res.data.likeData.likeType;
            this.likecount = this.likecount - 1;
            this.increasedLikecount = this.likecount;
          }
          else {
            this.toastr.error(res.message);
          }
        })
      }
    }
  }

  addComment() {
    this.isLoading = true;
    let data = {
      user_id: this.loggedInUserDetails._id,
      content_id: this.contentId,
      comment: this.addCommentForm.value.addcomment ? this.addCommentForm.value.addcomment : ""
    }
    this.manageMosque.addContentLikeCommentShare(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code == 200 && res.data) {
        this.addCommentForm.reset();
        this.getlistLikeCommentShare();
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }


  replyButton(id) {
    this.commentId = id;
    this.replycomment = false;
  }

  addCommentReply(id) {
    this.isLoading = true;
    let data = {
      comment_id: id,
      content_id: this.contentId,
      user_id: this.loggedInUserDetails._id,
      commentReply: this.addCommentReplyForm.value.addcommentreply ? this.addCommentReplyForm.value.addcommentreply : ""
    }
    this.manageMosque.addContentLikeCommentShare(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code == 200 && res.data) {
        this.addCommentReplyForm.reset();
        this.getlistLikeCommentShare();
        this.replycomment = true;
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }
  ngOnDestroy(){
    this.suspendVideo();
  }
}