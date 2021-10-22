import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import {
  NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import { environment } from '../../environments/environment';
import {appConfig} from '../core/app.config'

@Component({
  selector: 'app-home',
  preserveWhitespaces: false,
  styleUrls: ['./home_page.component.scss'],
  templateUrl: './home_page.component.html',
})
export class HomeComponent {
  viewCustomObjectList: any;
  videos = [];
  topics = [];
  displayDelete: boolean = false;
  id: any;
  totalCount: number = 0;// taking from response dynamic
  count: number = 20;//data to show on table
  page: number = 1;//page of table
  pageCountLink: any; //total count/count;
  desLength: any;
  searchTextForm: FormGroup;
  contentType: string;
  videoTitle: string;
  topicTitle: string;
  imageurl: string = environment.backendBaseUrl;
  limitForTitle: number = appConfig.limitForHomeContentTitle.TO;
  limitForDescription: number = appConfig.limitForContentDescription.TO;
  images = [
    {i:'../assets/images/slider_th1.png'}, 
    {i:'../assets/images/slider_th2.png'}, 
    {i:'../assets/images/slider_th3.png'}, 
    {i:'../assets/images/slider_th4.png'}, 
    {i:'../assets/images/slider_th2.png'}, 
    {i:'../assets/images/slider_th3.png'}, 
    {i:'../assets/images/slider_th4.png'}
  ]
  constructor(
    private toastr: ToastrService,
   // private manageContent: HealthContentService,
  ) { }
  public ngOnInit() {
    /*this.healthVideoListing('video');
    this.healthTopicListing('topic');*/
  }

/*  globalSearchResult(data) {
    this.globalSearchResponse = data;
    this.healthTopicListing('topic');
    this.healthVideoListing('video');
  }
  
  healthTopicListing(contentType) {
    let data = {
      "count": this.count,
      "page": this.page,
      "searchText": this.globalSearchResponse ? this.globalSearchResponse : '',
      "contentType": contentType,
      "isGlobal" : true
    }
    this.manageContent.listGeneralContent(data).subscribe(res => {
      if (res && res.code == 200 && res.data) {
        this.topics = [];
        var tempTopics = res.data;
        tempTopics = res.data;
        this.totalCount = res.totalCount;
        this.pageCountLink = (this.totalCount / this.count);
        this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        this.pageCountLink = parseInt(this.pageCountLink);
        for (var i = 0; i < this.count; i++) {
          if (tempTopics && tempTopics[i] && tempTopics[i].contentDescription) {
            tempTopics[i].contentDescription = tempTopics[i].contentDescription.replace(/<[^>]*>/g, '');
            tempTopics[i].image = '../assets/images/slider_th2.png'
            if (tempTopics[i].contentDescription.length > 110) {
              tempTopics[i].display = true
            } else {
              tempTopics[i].display = false
            }
            this.topics.push(tempTopics[i])
          }
        }
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  healthVideoListing(contentType) {
    let data = {
      "count": this.count,
      "page": this.page,
      "searchText": this.globalSearchResponse ? this.globalSearchResponse : '',
      "contentType": contentType ,
      "isGlobal" : true
    }

    this.manageContent.listGeneralContent(data).subscribe(res => {
      if (res && res.code == 200 && res.data) {

        this.videos = [];
        var tempTopics = res.data;
        tempTopics = res.data;
        this.totalCount = res.totalCount;
        this.pageCountLink = (this.totalCount / this.count);
        this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        this.pageCountLink = parseInt(this.pageCountLink);
        for (var i = 0; i < this.count; i++) {
          if (tempTopics && tempTopics[i] && tempTopics[i].contentDescription) {
            tempTopics[i].contentDescription = tempTopics[i].contentDescription.replace(/<[^>]*>/g, '');
            tempTopics[i].image = '../assets/images/slider_th1.png'
            if (tempTopics[i].contentDescription.length > 110) {
              tempTopics[i].display = true
            } else {
              tempTopics[i].display = false
            } 
            if (tempTopics[i].isEmbedded) {
              tempTopics[i].thumbnail = `https://img.youtube.com/vi/${tempTopics[i].contentUrl}/default.jpg`
            }
            else{
             
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
  getStringCount(description) {
    if (description.length > 25) {
      return true
    } else {
      return false
    }
  }

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }*/
}