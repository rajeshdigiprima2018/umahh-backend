import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  @Output() globalSearchResponse = new EventEmitter();
  globalSearchForm: FormGroup;
  viewCustomObjectList: any ;
  videos = [];
  topics = [];
  displayDelete: boolean = false;
  id: any;
  totalCount: number = 0;// taking from response dynamic
  count: number = 5;//data to show on table
  page: number = 1;//page of table
  pageCountLink: any; //total count/count;
  desLength: any;
  searchTextForm: FormGroup;
  contentType : string ;
  videoTitle : string ;
  topicTitle : string ;
  activeclass : boolean = false ;
  displayInput : boolean = false ;
  curUrl : any;
  activeClassVideo : boolean = false;
  activeClassTopic : boolean = false;
  videoInfo : string = '/videoinfo/'
  topicInfo : string = '/topicinfo/'
  
        constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private router : Router
        ) { }

  ngOnInit() {
    this.curUrl = this.router.url
    if(this.curUrl.match(this.videoInfo)){
      this.activeClassVideo = true
    }
    else if(this.curUrl.match(this.topicInfo)){
      this.activeClassTopic = true
    }

    this.globalSearchForm = this.formBuilder.group({
      searchText: new FormControl(''),
  });
  this.globalSearchContent();
  }

  displayInputSearch(){
    this.displayInput = !this.displayInput;
  }
  globalSearchContent() {
    this.globalSearchResponse.emit(this.globalSearchForm.value.searchText);
    const clearSearch = this.globalSearchForm.get('searchText');
    clearSearch.reset();
    
  }
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "256px";
    this.activeclass = !this.activeclass;
  }

  closeNav() {
    this.activeclass = !this.activeclass;
    document.getElementById("mySidenav").style.width = "0";
  }
}
