import { Component, OnInit } from '@angular/core';
import { ManageRoleService } from './service/manage-role.service';
import { WebStorage } from '../../core/web.storage';
import { LocalStorageService } from 'ngx-webstorage/dist/services/localStorage';
import { MessageService } from 'primeng/components/common/messageservice';
import { routerTransition } from '../../router.animations';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from "@angular/forms";
import { appConfig } from '../../core/app.config';
import { Observable } from 'rxjs';
import { CommonService } from '../../core/commonService';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss'],
  animations: [routerTransition()],
  providers: [
    ManageRoleService
  ]
})
export class ManageRoleComponent implements OnInit {
  roleForm: FormGroup;
  searchRoleForm: FormGroup;
  btnMode: string = 'Create';
  setHeadMode: string = 'Create Role';
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  displayModal: boolean = false;
  roleList: any = [];
  router: any;
  detailForList: any = {};
  roleId: '';
  constructor(
    private manageRoleService: ManageRoleService,
    private localSt: LocalStorageService,
    private alertService: MessageService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    public sharedService: SharedService,
    private toastr: ToastrService

  ) {

  }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.roleForm = this.formBuilder.group({
      roleName: ['', [Validators.required, Validators.maxLength(appConfig.pattern.MAXLENGTH), Validators.minLength(appConfig.pattern.MINLENGTH), Validators.pattern(appConfig.pattern.NAME)]],
      topics: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      role: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      group: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      video: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      setting: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      clinicStaff: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      survey: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
      patient: this.formBuilder.group({
        view: [''],
        create: [''],
        edit: [''],
        delete: ['']
      }),
    });
    this.searchRoleForm = this.formBuilder.group({
      searchText: new FormControl(''),
    });
    this.getRoleListing();
  }
  delete(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        let tempObj = {
          roleId: id
        }
        this.manageRoleService.deleteRole(tempObj).subscribe((result: any) => {
          this.isLoading = false;
          if (result && result.code == 200) {
            this.getRoleListing();
            this.toastr.success(result.message);
            
          } else if (result && result.code == 402) {
            this.toastr.info(result.message);
          } else if (result && result.code == 500) {
            this.toastr.error(result.message);
            
          }
        })
      },
      reject: () => {
        return false;
      }
    });
  }
  createRole(id: any) {
    this.isLoading = true;
    if (this.loggedInUserDetails.userType != "clinic") {
      this.roleForm.value.patient_id = this.loggedInUserDetails.patient_id;
    }
    this.roleForm.value.userType = this.loggedInUserDetails.userType;
    this.roleForm.value.created_by_id = this.loggedInUserDetails._id;
    if (id) {
      this.roleForm.value.role_id = id;
    }
    if(this.loggedInUserDetails.userType == appConfig.userType.ADMIN){
      this.roleForm.value.created_by_id=appConfig.admin.ID;
    }
    this.manageRoleService.saveRole(this.roleForm.value).subscribe((result: any) => {
      this.isLoading = false;
      if (result && result.code == 200) {
        this.getRoleListing();
        this.toastr.success(result.message);
      } else if (result && result.code == 402) {
        this.toastr.info(result.message);
      } else if (result && result.code == 500) {
        this.toastr.error(result.message);
      }
    })
  }

  getRoleListing() {
    let id;
    if (this.loggedInUserDetails.userType == "admin") {
      id = this.loggedInUserDetails._id
    }
    else {
      id = '';
    }
    this.detailForList = {
      "count": 0,
      "page": 1,
      "searchText": this.searchRoleForm.value.searchText ? this.searchRoleForm.value.searchText : '',
      "userType": this.loggedInUserDetails.userType,
      "parent_id": this.loggedInUserDetails.parent_id ? this.loggedInUserDetails.parent_id : id,
      "created_by_id": this.loggedInUserDetails._id
    }
    this.manageRoleService.getRoleListing(this.detailForList)
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res.code == 200) {
          if (res.data.length) {
            let i = 0, len = res.data.length;
            for (i; i < len; i++) {
              if (this.loggedInUserDetails.userType != 'admin' && res.data[i].created_by_id == appConfig.admin.ID) {
                res.data[i].isEditable = true;
              } else {
                res.data[i].isEditable = false;
              }
            }

          }
          this.roleList = res.data ? res.data : this.roleList;
        } else {
          this.toastr.error(res.message);
        }
      });
  }
  setMode(mode: string, id) {
    this.roleId = '';
    if (mode == 'Edit') {
      this.btnMode = 'Save'
      this.setHeadMode = 'Update Role'
      this.getRoleDetailsById(id);
    }
  }
  resetForm(form) {
    this.roleId = '';
    form.reset();
  }
  getRoleDetailsById(id) {
    this.isLoading = true;
    this.manageRoleService.getRoleById(id)
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res.code == 200) {
          this.roleId = res.data._id;
          this.roleForm.patchValue({
            roleName: res.data.roleName,
            role: res.data.role,
            topics: res.data.topics,
            setting: res.data.setting,
            clinicStaff: res.data.clinicStaff,
            group: res.data.group,
            video: res.data.video,
            
            survey: res.data.survey,
            patient: res.data.patient
          });
          this.roleForm.updateValueAndValidity();
        } else {
          this.toastr.error(res.message);
         
        }
      });
  }


}
