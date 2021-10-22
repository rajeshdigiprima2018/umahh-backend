import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { ActivatedRoute } from '@angular/router';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-edit-association',
  templateUrl: './edit-association.component.html',
  styleUrls: ['./edit-association.component.scss']
})
export class EditAssociationComponent implements OnInit {
  editTopicForm: FormGroup;
  topicDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  pdfUrl:string;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  
  constructor(
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private manageMosqueService:ManageMosqueService,
    private router:Router
  ) {
    this.categoryType = [
      { label: 'Select Category', value: null }
    ];
   }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);

    this.editTopicForm= this.fb.group({  
      title:['', [Validators.required, Validators.pattern(appConfig.pattern.NAME)]],
      category :['', [Validators.required]],   
      status:['', [Validators.required, Validators.pattern(appConfig.pattern.NAME)]],   
      description:['', [Validators.required, Validators.pattern(appConfig.pattern.DESCRIPTION)]],
      uploadedBy:[this.loggedInUserDetails._id]      
    })
    this.categoryList();
    this.getTopicById();    
  }

  categoryList(){
    this.manageMosqueService.categoryList({}).subscribe((result: any) => {
        if(result.data.length && result.code == 200){
          for(let i=0; i<result.data.length; i++){
            let obj = {
              label: result.data[i].name,
              value: result.data[i]._id
            }
            this.categoryType.push(obj);
          }
        }
    })
  }

  getTopicById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getContentListId(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data.data){
          this.pdfUrl=res.data.data.contentUrl;
          this.editTopicForm.patchValue({
            title:res.data.data.contentTitle,
            status:res.data.data.privacyType,
            description:res.data.data.contentDescription
          })
          this.selectedCategory = res.data.data.category;
          this.topicDetail=res.data.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.editTopicForm.get('title').value);
    inputData.append('status', this.editTopicForm.get('status').value);
    inputData.append('category', this.editTopicForm.get('category').value);
    inputData.append('description', this.editTopicForm.get('description').value);
    inputData.append('uploadedBy', this.loggedInUserDetails._id);
    inputData.append('contentType', 'topic');
    inputData.append('id', this.topicDetail._id);
    return inputData;
  }

  editTopic(){
    this.isLoading = true;
    const formModel = this.prepareSave();
      this.manageMosqueService.editContent(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res && res.code==200){
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageContent/listTopics'])
        }else{
          this.toastr.error(res.message);
        }
      })
  
  }
}
