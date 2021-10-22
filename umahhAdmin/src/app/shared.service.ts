import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public headerUserName: any = '';
  public globalImage: any = '';
  loggedInUserDetails: any;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'myTableIdElementId', // the id of html/table element,
    options: { // html-docx-js document options
      orientation: 'landscape',
      margins: {
        top: '20'
      }
    }
  }

  constructor(
    private localSt: LocalStorageService,
    private exportAsService: ExportAsService
  ) {
    this.getDetails();
  }
  getDetails() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    if (this.loggedInUserDetails) {
      this.globalImage = this.loggedInUserDetails.image ? this.loggedInUserDetails.image : this.globalImage;
      if (this.loggedInUserDetails.userType == "user" || this.loggedInUserDetails.userType == "staff") {
        this.headerUserName = this.loggedInUserDetails.firstName + this.loggedInUserDetails.lastName;
      } else {
        this.headerUserName = this.loggedInUserDetails.clinicName
      }
    }
  }
  getLogInDetails(): Observable<any> {
    return this.loggedInUserDetails
  }
  setHeaderName(name: any): Observable<any> {
    this.headerUserName = name;
    return this.headerUserName
  }
  setImage(url: any): Observable<any> {
    this.globalImage = url;
    return this.globalImage
  }
  checkPermission(field, key): Observable<any> {
    this.getDetails();
    // console.log("field:::>",field,"key:::::>",key);
    // if (this.loggedInUserDetails && this.loggedInUserDetails.userType == 'admin') {
    //   return Observable.of(true);
    // } else {
    if (this.loggedInUserDetails && this.loggedInUserDetails.role_id) {
      // console.log("field:::::",this.loggedInUserDetails.role_id,"key:::::::>",this.loggedInUserDetails.role_id[field][key]);
      return this.loggedInUserDetails.role_id[field][key];
    } else {
      return Observable.of(false);
    }
    // }
  }
  exportToPdf(expType: any, expId: any, expOrientation: any, expFileName: any): Observable<any> {
    var res
    this.exportAsConfig = {
      type: expType, // the type you want to download
      elementId: expId, // the id of html/table element,
      options: { // html-docx-js document options
        orientation: expOrientation
      }
    }
    try {
      // this.exportAsService.save(this.exportAsConfig, expFileName);
      // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
      this.exportAsService.get(this.exportAsConfig).subscribe(content => {
        res = content;
        // console.log("content res come by saving as pdf", res);
        // console.log(content);
      });
    } catch (err) {
      // console.log("Error on exporting file to pdf", err);
      res = err;
    }

    // download the file using old school javascript method

    return res
  }

}
