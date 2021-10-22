import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { appConfig } from '../core/app.config';
import { ContactUsService } from './service/contact-us.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactUsForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactUs : ContactUsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.contactUsForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(appConfig.pattern.EMAIL)])],
      name: ['', [Validators.required, Validators.minLength(appConfig.pattern.MINLENGTH), Validators.maxLength(appConfig.pattern.MAXLENGTH), Validators.pattern(appConfig.pattern.NAME)]],
      message: ['', [Validators.required]],
     
    });
  }

  sendInfo(){
    this.isLoading = true;
    let data = {
      email :  this.contactUsForm.value.email ? this.contactUsForm.value.email : '',
      name  :  this.contactUsForm.value.name ? this.contactUsForm.value.name : '',
      message : this.contactUsForm.value.message ? this.contactUsForm.value.message : ''
    }
    this.contactUs.sendContactInfo(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code == 200 && res.data) {
        this.contactUsForm.reset();
        this.toastr.success(res.message);
      }
      else{
        this.contactUsForm.reset();
        this.toastr.error(res.message);
      }
    })
  }

}
