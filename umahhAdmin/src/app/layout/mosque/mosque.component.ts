import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { DialogService } from "ng2-bootstrap-modal";
import { ConfirmComponent } from '../users/Modal/confirm.component';
import { ToastrService } from 'ngx-toastr';
import { MosqueService } from './services/mosque.service';
import { SharedService } from '../../shared.service';
import { routerTransition } from '../../router.animations';


@Component({
    selector: 'app-mosque',
    templateUrl: './mosque.component.html',
    styleUrls: ['./mosque.component.scss'],
    animations: [routerTransition()]
})
export class MosqueComponent implements OnInit {

    loggedInUserDetails: any = '';
    display: boolean = false;
    displayDelete: boolean = false;
    paginator: boolean = true;
    userData: any = [];
    _id: any;
    count: number = appConfig.paginator.COUNT;
    page: number = appConfig.paginator.PAGE;
    totalCount: number = 0;
    pageCountLink: any;
    editUserId: any;
    addUserForm: FormGroup;
    searchUserForm: FormGroup;
    userDetails: any;
    selectedRole: any;
    sub: any;
    created_by_id: string;
    disabledBtn: boolean = false;
    isLoading: boolean = false;
    displayUpdateStatus:boolean=false;
    updateStatusData:any={};
    dataRole:any = '';
    mosque:any = [];




    constructor(
        private translate: TranslateService,
        private localSt: LocalStorageService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private dialogService: DialogService,
        public sharedService: SharedService,
        private mosqueService: MosqueService) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
    }

    ngOnInit() {
        this.loggedInUserDetails = this.localSt.retrieve('all');
        this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
        this.searchUserForm = this.formBuilder.group({
            searchText: new FormControl(''),
        });
        this.getMosque();
       // this.searchUser();
    }
    getMosque() {
        this.dataRole = {
            "role" : "mosque",
            "count": this.count,
            "page" : this.page
        }

        this.mosqueService.getMosqueListing(this.dataRole).subscribe(res => {
            if (res.code == 200) {
                this.mosque = res.data;
                this.totalCount = res.totalCount;
                this.pageCountLink = (this.totalCount / this.count);
                this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
                this.pageCountLink = parseInt(this.pageCountLink);
            }
        });
    }

    paginate(event) {
        this.page = event.page + 1;
        this.getMosque();
    }
    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

   showConfirm() {
        let disposable = this.dialogService.addDialog(ConfirmComponent, {
            title: 'Confirm title',
            message: 'Confirm message'
        })
            .subscribe((isConfirmed) => {

                if (isConfirmed) {
                    alert('accepted');
                }
                else {
                    alert('declined');
                }
            });

        setTimeout(() => {
            disposable.unsubscribe();
        }, 10000);
    }

    showDeleteDialog(id) {
        this.displayDelete = true;
        this._id = id;

    }

    deleteMosque() {
        this.isLoading = true;
        this.mosqueService.deleteMosque(this._id).subscribe(res => {
          this.isLoading = false;
          if (res.code == 200) {
            this.displayDelete = false;
            this.toastr.success(res.message);
            this.getMosque();
          } else {
            this.toastr.error(res.message);
            this.getMosque();
          }

        })
    }


/*    showConfirm() {
        let disposable = this.dialogService.addDialog(ConfirmComponent, {
            title: 'Confirm title',
            message: 'Confirm message'
        })
            .subscribe((isConfirmed) => {

                if (isConfirmed) {
                    alert('accepted');
                }
                else {
                    alert('declined');
                }
            });

        setTimeout(() => {
            disposable.unsubscribe();
        }, 10000);
    }

    showDeleteDialog(id) {
        this.displayDelete = true;
        this.id = id;

    }

    showDialog(userId?) {
        this.display = true;
        if (userId) {
            this.getUserDetails(userId);
            this.editUserId = userId;
            this.btnMode = "Save";
        }
    }
    closeDialog() {
        this.addUserForm.reset();
        this.display = false;
        this.btnMode = 'Create';
    }

    addUser() {
        this.isLoading = true;

        let data = {
            email: this.addUserForm.value.email,
            firstName: this.addUserForm.value.firstName,
            lastName: this.addUserForm.value.lastName,
            roleId: this.addUserForm.value.role,

            createdId: appConfig.admin.ID,
            userType: "staff",

        }
        this.supportAdminService.addUser(data).subscribe(res => {
            this.isLoading = false;
            if (res && res.code == 200) {

                this.toastr.success("Support admin is added successfully");
            } else if (res && res.code == 402) {
                this.toastr.info(res.message);
            } else if (res && res.code == 500) {
                this.toastr.error(res.message);
            }
            else if (res && res.code == 401) {
                this.toastr.warning(res.message);
            }
            this.addUserForm.reset();
            this.searchUser();

        });

        this.display = false;
    }


    //----****get user listing and search user either by userName or email ***-----
    searchUser() {

        this.isLoading = true;
        let data;

        data = {
            "count": this.count,
            "page": this.page,
            "searchText": this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
            "created_by_id": appConfig.admin.ID
        }

        this.supportAdminService.getSearchUserDetails(data).subscribe(res => {
            this.isLoading = false;
            if (res && res.code == 200 && res.data) {
                this.userData = res.data ? res.data : this.userData;
                for (let i = 0; i < this.userData.length; i++) {
                    if (this.userData[i].status == 1) {
                        this.status = true;
                    }
                }
                this.totalCount = res.totalCount;
                this.pageCountLink = (this.totalCount / this.count);
                this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
                this.pageCountLink = parseInt(this.pageCountLink);

            } else if (res && res.code == 402) {
                this.toastr.info(res.message);
            } else if (res && res.code == 1004) {
                this.toastr.warning(res.message);
            } else if (res && res.code == 1002) {
                this.toastr.warning(res.message);
            } else if (res && res.code == 401) {
                this.toastr.warning(res.message);
            }
        });

    }

    paginate(event) {
        this.page = event.page + 1;
        this.searchUser();
    }
    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    functionSelect(btnMode: string, userId: string) {
        if (btnMode == "Edit") {
            this.editUser();
        }
        else if (btnMode == "Create") {
            this.addUser();
        }

    }


    getUserDetails(id) {
        this.isLoading = true;
        this.supportAdminService.getUserDetails(id).subscribe(res => {
            this.isLoading = false;
            this.userDetails = res.data[0];
            this.addUserForm.patchValue({
                email: this.userDetails.email,
                firstName: this.userDetails.firstName,
                lastName: this.userDetails.lastName,
                role: this.userDetails.role_id
            })
            this.selectedRole = this.userDetails.role_id;
        });
    }


    editUser() {
        this.isLoading = true;
        this.display = true;
        this.getUserDetails(this.editUserId);
        let data = {
            userId: this.editUserId,
            email: this.addUserForm.value.email,
            firstName: this.addUserForm.value.firstName,
            lastName: this.addUserForm.value.lastName,
            role: this.addUserForm.value.role,
            userType: 'staff'
        }
        this.supportAdminService.updateUser(data).subscribe(res => {
            this.isLoading = false;
            this.searchUser();
            this.addUserForm.reset();
            if (res && res.code == 200) {
                this.toastr.success(res.message);
            } else if (res && res.code == 500) {
                this.toastr.warning(res.message);
            } else if (res && res.code == 402) {
                this.toastr.info(res.message);
            }
        });

        this.display = false;
        this.btnMode = 'Create';
        this.setHeadMode = 'Create Staff'
    }

    deleteUser() {
        this.isLoading = true;
        let data = { id: this.id, userType: 'staff' }
        this.supportAdminService.deleteUser(data).subscribe(res => {
            this.isLoading = false;
            if (res && res.code == 200) {
                this.toastr.success(res.message);
            } else if (res && res.code == 500) {
                this.toastr.warning(res.message);
            } else if (res && res.code == 402) {
                this.toastr.warning(res.message);
            }
            this.displayDelete = false;
            this.searchUser();
        });
    }

    setMode(mode: string) {
        if (mode == 'Edit') {
            this.btnMode = 'Save'
            this.setHeadMode = 'Update Staff'
        }
        else {
            this.btnMode = 'Create'
            this.setHeadMode = 'Create Staff'
        }
    }*/


    closeUpdateStatusDialog(){
        this.displayUpdateStatus=false;
        //this.searchUser();
      }

    onStatusChange(event,userId) {
        this.displayUpdateStatus=true;
        if(event.target.checked == true){
          this.updateStatusData={
              status:"1",
            _id:userId
          }
        }else if(event.target.checked == false){
          this.updateStatusData={
            status:"0",
            _id:userId
          }
        }

      }


    updateStatus(){
        this.displayUpdateStatus=false;
        this.mosqueService.updateUserStatus(this.updateStatusData).subscribe(res => {
          this.isLoading = false;
          if(res.code==200){
            this.toastr.success(res.message);
            //this.searchUser();
          }else{
            this.toastr.error(res.message);
          }
        })
    }
}
