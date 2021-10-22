import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ConfirmComponent } from './Modal/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";
import { UserComponentService } from './services/user-component.service';
import { LocalStorageService } from 'ngx-webstorage/dist/services/localStorage';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ManageRoleService } from '../manage-role/service/manage-role.service';
import { appConfig } from '../../core/app.config';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { single } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared.service';
import { WebStorage } from "../../core/web.storage";
import { ActivatedRoute, Router } from '@angular/router';
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from 'survey-angular';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: [routerTransition()]
})
export class UsersComponent implements OnInit {
   
    loggedInUserDetails: any = '';
    display: boolean = false;
    displayDelete: boolean = false;
    paginator: boolean = true;
    userData: any = [];
    id: any;
    count: number = appConfig.paginator.COUNT;
    page: number = appConfig.paginator.PAGE;
    totalCount: number = 0;
    pageCountLink: any;
    editUserId: any;
    addUserForm: FormGroup;
    searchUserForm: FormGroup;
    roles: any;
    status: boolean = false;
    btnMode: string = 'Create';
    setHeadMode: string = 'Create User';
    roleType: SelectItem[] = [];
    detailForList: any;
    userDetails: any;
    selectedRole: any;
    sub: any;
    created_by_id: string;
    disabledBtn : boolean = false ; 
    displayActions:boolean=true;
    displayUpdateStatus:boolean=false;
    updateStatusData:any={};
    staffName:string;

    loader: boolean;
    showSurveyStatus: boolean;
    surveyListArr = [];
    surveyCount: number = appConfig.paginator.COUNT;
    surveyPage: number = appConfig.paginator.PAGE;
    surveyTotalCount: number = 0;
    surveyPageCountLink: any;
    assignSurveyArray = [];
    isAssignSurveyChecked: boolean;
    searchSurveyForm: FormGroup;
    surveyUserID: any;
    surveyUserEmail: any;   
    viewSurveyStatus:boolean=false; 
    surveyname: any;
    surveydescrption: any;
    json: any;
    editor: SurveyEditor.SurveyEditor;
    viewSurvey_id:string;
    isLoading: boolean = false;

    constructor(
        private dialogService: DialogService, 
        private userService: UserComponentService,
        private localSt: LocalStorageService,
        private formBuilder: FormBuilder,
        private roleList: ManageRoleService,
        private alertService: MessageService,
        private toastr: ToastrService,
        public sharedService :SharedService,
        private storage: WebStorage,
        private route: ActivatedRoute,
        private router:Router
    ) {
        this.roleType = [
            { label: 'Select Role', value: null },
          
        ];
    } 


    ngOnInit() {
        this.loggedInUserDetails = this.localSt.retrieve('all');
        this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
        this.searchUserForm = this.formBuilder.group({
            searchText: new FormControl(''),
        });
        this.addUserForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(appConfig.pattern.EMAIL)])],
            firstName: ['', [Validators.required, Validators.minLength(appConfig.pattern.MINLENGTH), Validators.maxLength(appConfig.pattern.MAXLENGTH), Validators.pattern(appConfig.pattern.NAME)]],
            lastName: ['', [Validators.required, Validators.minLength(appConfig.pattern.MINLENGTH), Validators.maxLength(appConfig.pattern.MAXLENGTH), Validators.pattern(appConfig.pattern.NAME)]],
            role: ['', [Validators.required]],

        });
        this.getRoles();

        if(this.router.url != '/userDetails'){
            this.sub = this.route.params.subscribe(params => {
                this.created_by_id = params['id'];
             });
        }

        this.searchUser();

        this.searchSurveyForm = this.formBuilder.group({
            searchSurveyText: new FormControl(''),
        })
        
        if(this.loggedInUserDetails.created_by_id==appConfig.admin.ID && this.loggedInUserDetails.userType=='staff'){
            this.displayActions=false;
         }
    }

    getRoles() {
        this.detailForList = {
            "count": 0,
            "page": 1,
            "searchText": "",
            "userType": this.loggedInUserDetails.userType,
            "parent_id": this.loggedInUserDetails.patient_id ? this.loggedInUserDetails.patient_id : '',
            "created_by_id": this.loggedInUserDetails._id
        }

        this.roleList.getRoleListing(this.detailForList).subscribe(res => {
            if (res.code == 200) {
                this.roles = res.data;
                for (let i = 0; i < this.roles.length; i++) {
                    let item;
                    if ( this.roles[i].created_by_id == appConfig.admin.ID){
                        item = {
                            label: this.roles[i].roleName + '  ' + '(Default)',
                            value: this.roles[i]._id
                        }
                    }else{
                         item = {
                            label: this.roles[i].roleName,
                            value: this.roles[i]._id
                        }
                    }
                    this.roleType.push(item);
                }
            }
        });
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



    showDeleteDialog(id,staffDetails) {
        this.displayDelete = true;
        this.id = id;
        this.staffName=staffDetails.userName;
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
            associated_clinic_id : this.loggedInUserDetails._id,
            associatedClinicName : this.loggedInUserDetails.clinicName,
            createdId: this.loggedInUserDetails._id,
            userType: "staff",
            isPatient : false,
            phoneNumber: this.loggedInUserDetails.mobileNumber
        }
        this.userService.addUser(data).subscribe(res => {
            this.isLoading = false;
            if (res && res.code == 200) {
               
                this.toastr.success("Staff is added successfully");
            }
           
            else {
                this.toastr.error(res.message);
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
        if(this.created_by_id != undefined && this.created_by_id != ''){
             data = {
                "count": this.count,
                "page": this.page,
                "searchText": this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
                "userId": this.created_by_id,
                "userType": "staff"
            }
        }else{
            if(this.loggedInUserDetails.userType == 'admin'){
                data = {
                    "count": this.count,
                    "page": this.page,
                    "searchText": this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
                    "userId": appConfig.admin.ID,   
                    "userType": appConfig.userType.ADMIN,
                    "requiredUserType" : "staff"
                }
            }else if(this.loggedInUserDetails.userType == 'staff' && this.loggedInUserDetails.created_by_id == appConfig.admin.ID){
                data = {
                    "count": this.count,
                    "page": this.page,
                    "searchText": this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
                    "userId":this.loggedInUserDetails.created_by_id,
                    "userType": appConfig.userType.ADMIN,
                    "requiredUserType" : "staff"
                }
            }
            else{
                data = {
                    "count": this.count,
                    "page": this.page,
                    "searchText": this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
                    "userId": this.loggedInUserDetails._id,
                    "userType": "staff"
                }
            }
          
        }
        this.userService.getSearchUserDetails(data).subscribe(res => {
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
        this.isLoading=true;
        this.userService.getUserDetails(id).subscribe(res => {
            this.isLoading=false;
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
        this.userService.updateUser(data).subscribe(res => {
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
        let data = { id : this.id , userType : 'staff' }
        this.userService.deleteUser(data).subscribe(res => {
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
    }
    onStatusChange(event,userId) {
        this.displayUpdateStatus=true;
        if(event.target.checked == true){
          this.updateStatusData={
            clinicStatus:"1",
            clinicId:userId
          }
        }else if(event.target.checked == false){
          this.updateStatusData={
            clinicStatus:"2",
            clinicId:userId
          }
        }

      }

      closeUpdateStatusDialog(){
        this.displayUpdateStatus=false;
        this.searchUser();
      }

      updateStatus(){
        this.isLoading = true;
        this.displayUpdateStatus=false;
        this.userService.updateUserStatus(this.updateStatusData).subscribe(res => {
              this.isLoading = false;
              if(res.code==200){
                this.toastr.success(res.message);
                this.searchUser();
              }else{
                this.toastr.error(res.message);
              }
            })
      }
}
