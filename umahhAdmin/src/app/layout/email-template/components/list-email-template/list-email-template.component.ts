import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmailTemplateService } from '../../services/email-template.service';
import { ToastrService } from 'ngx-toastr';
import { appConfig } from '../../../../core/app.config';
import { Router } from '@angular/router';
import { SharedService } from '../../../../shared.service';


@Component({
  selector: 'app-list-email-template',
  templateUrl: './list-email-template.component.html',
  styleUrls: ['./list-email-template.component.scss']
})
export class ListEmailTemplateComponent implements OnInit {
  templateData: any;
  searchTextForm: FormGroup;
  editEmailTemplateForm: FormGroup;
  emailTemplates: any = [];
  totalCount: number = 0;// taking from response dynamic
  count: number = appConfig.paginator.COUNT;//data to show on table
  page: number = appConfig.paginator.PAGE;//page of table
  pageCountLink: any; //total count/count;
  display: boolean = false;
  templateDetails: any;
  isLoading: boolean = false;
  leng:number;

  constructor(
    private emailTemplateService: EmailTemplateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchTextForm = this.fb.group({
      searchText: new FormControl('')
    });
    this.searchWithListing();

    this.editEmailTemplateForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(appConfig.pattern.NAME)]],
      subject: ['', [Validators.required, Validators.pattern(appConfig.pattern.NAME)]],
      description: ['', [Validators.required]],
    })

    var str = '??|sanika]';
    var strOne = /\[\[(.*?)\]\]/g;
  }
  searchWithListing() {
    this.isLoading=true;
    var data = {
      "count": this.count,
      "page": this.page,
      "searchText": this.searchTextForm.value.searchText ? this.searchTextForm.value.searchText : ''
    }
    this.emailTemplateService.listEmailTemplate(data).subscribe(res => {
      this.isLoading=false;
      if (res.code == 200) {
        this.emailTemplates = [];
        this.emailTemplates = res.data;
        this.totalCount = res.totalCount;
        this.pageCountLink = (this.totalCount / this.count);
        this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        this.pageCountLink = parseInt(this.pageCountLink);
        
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  paginate(event) {
    this.page = event.page + 1;

    this.searchWithListing();

  }
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  showDialog(template) {
    this.getTopicById(template._id);
    this.templateData = template;
    this.display = true;
  }
  closeDialog() {
    this.editEmailTemplateForm.reset();
    this.display = false;
  }

  getTopicById(templateId) {
    var reg = /\[\[(.*?)\]\]/g;
    this.isLoading=true;
    this.emailTemplateService.getTemplateById(templateId).subscribe((res: any) => {
      this.isLoading=false;
      if (res.code == 200) {
        this.editEmailTemplateForm.patchValue({
          title: res.data.title,
          subject: res.data.subject,
          description: res.data.description
        })
        this.templateDetails = res.data;
        this.leng=this.templateDetails.description.match(reg).length - 1;
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  readOnlyArr = ["[[FirstName]]", "[[LastName]]", "[[Link]]", "[[currYear]]"]
  onTextChange(event) {
    var reg = /\[\[(.*?)\]\]/g;
    if (!(event.textValue.match(reg).length == this.leng) && !(this.templateData.unique_keyword=="forgot_password")) {
      this.toastr.error("Not allowed to change this particular content");
      this.display=false;
    }
    else if (!(event.textValue.match(reg).length == this.leng-1) && (this.templateData.unique_keyword=="forgot_password")) {
      this.toastr.error("Not allowed to change this particular content");
      this.display=false;
    }
  }

  editEmailTemplate() {
    this.isLoading=true;
    this.editEmailTemplateForm.value.id = this.templateDetails._id
    this.emailTemplateService.editEmailTemplate(this.editEmailTemplateForm.value).subscribe((res: any) => {
      this.isLoading=false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.display = false;
        this.searchWithListing();
      } else {
        this.toastr.error(res.message);
      }
    })
  }
}
