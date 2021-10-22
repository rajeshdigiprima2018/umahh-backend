import { Component, OnInit } from '@angular/core';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-view-news',
  templateUrl: './view-news.component.html',
  styleUrls: ['./view-news.component.scss']
})
export class ViewNewsComponent implements OnInit {
  newsDetail:any;
  plainText: any
  isLoading: boolean = false;
  baseimageurl : string = environment.backendBaseUrl;
  imageurl : string = environment.backendBaseUrl;
  type: string;
  imgurl: any;
  startTime:any;
  maxDate:any;
  minDate:any;

  constructor(
    private route: ActivatedRoute, 
    private toastr: ToastrService, 
    private manageMosqueService: ManageMosqueService,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.getNewsById();
  }

  getNewsById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getNewsById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.imgurl = res.data.pictures[0].url 
          this.newsDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }
  navigate() {
    this._location.back();
  }
}
