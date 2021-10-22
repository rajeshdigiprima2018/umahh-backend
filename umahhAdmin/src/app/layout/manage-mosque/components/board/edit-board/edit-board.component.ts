import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { ActivatedRoute } from '@angular/router';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { environment } from '../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss'],
  animations: [routerTransition()]
})
export class EditBoardComponent implements OnInit {
  submitted = false;
  editBoardForm: FormGroup;
  form: FormGroup;
  loggedInUserDetails: any = '';
  videourl: any;
  isLoading: boolean = false;
  selectType: any;
  public thumbnailImage: any;
  boardDetails: any;
  baseimageurl : string = environment.backendBaseUrl;
  imageurl : string = environment.backendBaseUrl;
  type: string;
  imgurl: any;
  imageChange : boolean = false;
  boardInfo:any;


  constructor(
    private translate: TranslateService,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private manageMosqueService: ManageMosqueService,
    private router: Router
  ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
  }
  @ViewChild('fileInput') fileInput: ElementRef;
  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);

    this.form = this.fb.group({
      image: ['']
    });

    this.editBoardForm = this.fb.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      textarea: ['', [Validators.required]],
    })

   this.getBoardById();

  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      this.imageChange = true ;
      reader.onload = (event: ProgressEvent) => {
        this.imgurl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.form.get('image').setValue(file);

      const formData = new FormData();
      formData.append('image', this.form.get('image').value);
      this.route.params.subscribe(params => {
        this.manageMosqueService.boardUpdatePhoto(params['id'],formData).subscribe(res => {
          this.isLoading = false;
          if (res && res.code == 200) {
            this.boardInfo = res.data;
          } else if (res && res.code == 402) {
            this.toastr.info(res.message);
          } else {
            this.toastr.error(res.message);
          }
        });
      })
    }
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('name', this.editBoardForm.get('name').value);
    inputData.append('title', this.editBoardForm.get('title').value);
    inputData.append('textarea', this.editBoardForm.get('textarea').value);
   // inputData.append('image', this.editBoardForm.get('image').value);
   return inputData;
  }

  getBoardById() {
    this.isLoading=true;
    this.route.params.subscribe(params => {
      this.manageMosqueService.getBoardById(params['id']).subscribe((res: any) => {
        this.isLoading=false;
        this.imgurl = res.data.pictures[0].url
        if (res.code == 200) {
          this.editBoardForm.patchValue({
            title: res.data.title,
            name: res.data.name,
            textarea: res.data.textarea,
            image:res.data.pictures[0].url
          })
          this.boardDetails = res.data;
        } else {
          this.toastr.error(res.message);
        }
      })
    })
  }
  get f() { return this.editBoardForm.controls; }
  editBoard(){
    this.submitted = true;
    if (this.editBoardForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const formModel = this.prepareSave();
      this.manageMosqueService.editBoardById(params['id'],formModel).subscribe((res: any) => {
        this.isLoading = false;
        if (res.code == 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageMosque/listBoard']);
        } else {
          this.toastr.error(res.message);
        }
      })
    })
  }

  navigateToListing(){
    this.router.navigate(['/layout/manageContent/listVideos']);
  }
}

