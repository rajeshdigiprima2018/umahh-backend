import { Component, OnInit } from '@angular/core';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedService } from '../../../../../shared.service';
import { appConfig } from '../../../../../core/app.config';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'],
  animations: [routerTransition()]
})
export class ListPaymentComponent implements OnInit {
  searchTextForm: FormGroup;
  loggedInUserDetails: any = '';
  displayTransferPayment: boolean = false;
  id: any;
  totalCount: number = 0;// taking from response dynamic
  count: number = appConfig.paginator.COUNT;//data to show on table
  page: number = appConfig.paginator.PAGE;//page of table
  pageCountLink: any; //total count/count;
  isLoading: boolean = false;
  loggedInId: string;
  mosqueDonationList:any=[];
  updateStatusData: any={};
  tranferStatus:boolean =false;
  amountTotal:any = 0;
  payAmountTotal: any = 0;
  constructor(
    private translate: TranslateService,
    private manageMosqueService: ManageMosqueService,
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    public sharedService: SharedService,
    private router: Router
  )
  {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.loggedInId = this.loggedInUserDetails._id;
    this.getPaymentList();
  }

  showDeleteDialog(id) {
    this.displayTransferPayment = true;
    this.id = id;

  }
  onStatusChange(event,amount,tranferStatus,mosqueId,textId) {
    this.tranferStatus = true;
    this.amountTotal = amount;
    this.payAmountTotal = this.amountTotal - Math.round((this.amountTotal * 10) / 100);

    this.displayTransferPayment = true;
    if(event.target.checked == true){
      this.updateStatusData = {
        "mosqueId": mosqueId,
        "amount": this.payAmountTotal,
        "textId": textId
      }
    }
    else if(event.target.checked == false){
      this.updateStatusData={
        "mosqueId": mosqueId,
        "amount": this.payAmountTotal,
        "textId": textId
      }
    }
  }

  transferAmount() {
    this.isLoading = true;
    this.manageMosqueService.transferpaymenttomosque(this.updateStatusData).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.displayTransferPayment = false;
        this.toastr.success(res.message);
        this.getPaymentList();
      } else {
        this.toastr.error(res.message);
        this.getPaymentList();
      }

    })
  }

  getPaymentList() {
    this.isLoading = true;
    let data = {
      "count": this.count,
      "page": this.page
    }
    this.manageMosqueService.getPaymentList(data).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.mosqueDonationList = res.data;
        this.totalCount = res.totalCount;
        this.pageCountLink = (this.totalCount / this.count);
        this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        this.pageCountLink = parseInt(this.pageCountLink);

      } else {
        this.toastr.error(res.message);

      }
    })
  }

  paginate(event, value) {
    this.page = event.page + 1;
    this.getPaymentList();
  }

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

}
