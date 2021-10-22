import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  searchUserForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  mosque:any =[];
  Associeted_user:any;
  displayUpdateStatus:any;
  closeUpdateStatusDialog:any;
  updateStatus:any;



  constructor(private fb:FormBuilder,private toastr: ToastrService,private localSt: LocalStorageService, private manageMosqueService:ManageMosqueService,private router:Router)
   {
    this.categoryType = [
      { label: 'Select Category', value: null }
    ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);  
    this.searchUserForm = this.fb.group({
      searchText: new FormControl(''),
    });
    this.getMosque();
  }
  searchUser() {
    this.isLoading = true;
    if(this.searchUserForm.value.searchText==''){
      this.isLoading = false;
      this.getMosque();
    }else{
    
      let searchMosque = {
        "searchmosque": this.searchUserForm.value.searchText
      }  
      this.manageMosqueService.getSearchMosque(searchMosque).subscribe(res => {
        this.isLoading = false;
        if (res.code == 200) {
          this.mosque = res.data;
            
        }
      });
    }
    

  }
  getMosque() {
    let dataRole = {
    "role": "mosque"
    }

    this.manageMosqueService.getMosqueListing(dataRole).subscribe(res => {
        if (res.code == 200) {
          this.mosque = res.data;
          for (let i = 0; i < this.mosque.length; i++) {
            if (this.mosque[i]._id == this.loggedInUserDetails._id) {
              this.Associeted_user =this.mosque[i].associates_id.associate_user; 
             this.mosque.splice(i, 1);
            }
          }  
        }
    });
  }
  onStatusChange(event,userId) {
    let addAssociation={
      mosque_id:this.loggedInUserDetails._id,
      associate_user:userId
    }
    this.manageMosqueService.addAssociates(addAssociation).subscribe(res => {
      this.isLoading = false;
      if(res.code==200){
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listAssociation'])
      }else{
        this.toastr.error(res.message);
      }
    })
  }

}
