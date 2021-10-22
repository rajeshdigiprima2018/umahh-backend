import { Component, OnInit } from '@angular/core';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-view-khutba',
  templateUrl: './view-khutba.component.html',
  styleUrls: ['./view-khutba.component.scss']
})
export class ViewKhutbaComponent implements OnInit {
  topicDetails = new Array;
  plainText: any
  isLoading: boolean = false;
  imageurl: string = environment.backendBaseUrl;

  constructor(
    private route: ActivatedRoute, 
    private toastr: ToastrService, 
    private manageMosqueService: ManageMosqueService,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.getTopicById();
  }

  getTopicById() {
    this.isLoading=true;
    this.route.params.subscribe(params => {
      this.manageMosqueService.getContentListId(params['id']).subscribe((res: any) => {
        this.isLoading=false;
        if (res.code == 200 && res.data.data) {
          this.topicDetails.push(res.data.data);
         
        } else {
          this.toastr.error(res.message);
        }
      })
    })
  }
  navigate() {
    this._location.back();
  }
}
