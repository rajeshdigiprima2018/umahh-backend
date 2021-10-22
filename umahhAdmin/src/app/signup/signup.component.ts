import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { SignUpService } from './services/signup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { appConfig } from '../core/app.config';
import { CustomValidators } from 'ng2-validation';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    isLoading: boolean = false;
    showClinic: boolean = false;
    showWelcome: boolean = false;
    successEmail: String = '';
    signUpForm: FormGroup;
    searchUserForm: FormGroup;
    clinics: any = [];
    showInputBox: boolean = false;
    dropDownText: string;
    clinicDetail: any = [];
    isReadOnly: boolean = false;
    isValidationForMobileNumber: boolean = false;
    errMsg: string = '';
    hideLogin: boolean = false;
    count: number = 6;
    page: number = 1;
    totalCount: number = 0;
    pageCountLink: any;
    showClinicDiv: boolean = false;
    newClinics: any = [];
    resultClinicName: string;
    mobileReadOnly: boolean = true;
    placeHolderString: string = "Select or add clinic";
    isUrl: boolean = false;
    getClinicStaffListStatus: boolean = false;
    baseurl: string = environment.baseUrl;
    clinic_provider_id: string = '';
    displayTermsClinic: boolean = false;
    displayTermsUser: boolean = false;
    clinicCategoryList: any = [];
   // clinicCategoryList: SelectItem[] = [];

    countries = [{ "name": "Afghanistan", "code": "93", "char": "AF" },
    { "name": "Albania", "code": "355", "char": "AL" }, { "name": "Algeria", "code": "213", "char": "DZ" }, { "name": "American Samoa", "code": "1684", "char": "AS" }, { "name": "Andorra", "code": "376", "char": "AD" }, { "name": "Angola", "code": "244", "char": "AO" }, { "name": "Anguilla", "code": "1264", "char": "AI" }, { "name": "Antigua and Barbuda", "code": "1268", "char": "AG" }, { "name": "Argentina", "code": "54", "char": "AR" }, { "name": "Armenia", "code": "374", "char": "AM" }, { "name": "Aruba", "code": "297", "char": "AW" }, { "name": "Australia", "code": "61", "char": "AU" }, { "name": "Austria", "code": "43", "char": "AT" }, { "name": "Azerbaijan", "code": "994", "char": "AZ" }, { "name": "Bahrain", "code": "973", "char": "BH" }, { "name": "Bangladesh", "code": "880", "char": "BD" }, { "name": "Barbados", "code": "1246", "char": "BB" }, { "name": "Belarus", "code": "375", "char": "BY" }, { "name": "Belgium", "code": "32", "char": "BE" }, { "name": "Belize", "code": "501", "char": "BZ" }, { "name": "Benin", "code": "229", "char": "BJ" }, { "name": "Bermuda", "code": "1441", "char": "BM" }, { "name": "Bhutan", "code": "975", "char": "BT" }, { "name": "Bolivia", "code": "591", "char": "BO" }, { "name": "Bonaire", "code": "5997", "char": "BQ" }, { "name": "Bosnia and Herzegovina", "code": "387", "char": "BA" }, { "name": "Botswana", "code": "267", "char": "BW" }, { "name": "Brazil", "code": "55", "char": "BR" }, { "name": "British Indian Ocean Territory", "code": "246", "char": "IO" }, { "name": "Brunei", "code": "673", "char": "BN" }, { "name": "Bulgaria", "code": "359", "char": "BG" }, { "name": "Burkina Faso", "code": "226", "char": "BF" }, { "name": "Burundi", "code": "257", "char": "BI" }, { "name": "Cambodia", "code": "855", "char": "KH" }, { "name": "Cameroon", "code": "237", "char": "CM" }, { "name": "Canada", "code": "1", "char": "CA" }, { "name": "Cape Verde", "code": "238", "char": "CV" }, { "name": "Cayman Islands", "code": "1345", "char": "KY" }, { "name": "Central African Republic", "code": "236", "char": "CF" }, { "name": "Chad", "code": "235", "char": "TD" }, { "name": "Chile", "code": "56", "char": "CL" }, { "name": "China", "code": "86", "char": "CN" }, { "name": "Christmas Island", "code": "61", "char": "CX" }, { "name": "Cocos (Keeling) Islands", "code": "61", "char": "CC" }, { "name": "Colombia", "code": "57", "char": "CO" }, { "name": "Comoros", "code": "269", "char": "KM" }, { "name": "Cook Islands", "code": "682", "char": "CK" }, { "name": "Costa Rica", "code": "506", "char": "CR" }, { "name": "Croatia", "code": "385", "char": "HR" }, { "name": "Cuba", "code": "53", "char": "CU" }, { "name": "Curaçao", "code": "599", "char": "CW" }, { "name": "Cyprus", "code": "357", "char": "CY" }, { "name": "Czech Republic", "code": "420", "char": "CZ" }, { "name": "Democratic Republic of the Congo", "code": "243", "char": "CD" }, { "name": "Denmark", "code": "45", "char": "DK" }, { "name": "Djibouti", "code": "253", "char": "DJ" }, { "name": "Dominica", "code": "1767", "char": "DM" }, { "name": "Dominican Republic", "code": "1809", "char": "DO" }, { "name": "Ecuador", "code": "593", "char": "EC" }, { "name": "Egypt", "code": "20", "char": "EG" }, { "name": "El Salvador", "code": "503", "char": "SV" }, { "name": "Equatorial Guinea", "code": "240", "char": "GQ" }, { "name": "Eritrea", "code": "291", "char": "ER" }, { "name": "Estonia", "code": "372", "char": "EE" }, { "name": "Ethiopia", "code": "251", "char": "ET" }, { "name": "East Timor", "code": "670", "char": "TL" }, { "name": "Falkland Islands", "code": "500", "char": "FK" }, { "name": "Faroe Islands", "code": "298", "char": "FO" }, { "name": "Fiji", "code": "679", "char": "FJ" }, { "name": "Finland", "code": "358", "char": "FI" }, { "name": "France", "code": "33", "char": "FR" }, { "name": "French Guiana", "code": "594", "char": "GF" }, { "name": "French Polynesia", "code": "689", "char": "PF" }, { "name": "Federated States of Micronesia", "code": "691", "char": "FM" }, { "name": "Gabon", "code": "241", "char": "GA" }, { "name": "Georgia", "code": "995", "char": "GE" }, { "name": "Germany", "code": "49", "char": "DE" }, { "name": "Ghana", "code": "233", "char": "GH" }, { "name": "Gibraltar", "code": "350", "char": "GI" }, { "name": "Greece", "code": "30", "char": "GR" }, { "name": "Greenland", "code": "299", "char": "GL" }, { "name": "Grenada", "code": "1473", "char": "GD" }, { "name": "Guadeloupe", "code": "590", "char": "GP" }, { "name": "Guam", "code": "1671", "char": "GU" }, { "name": "Guatemala", "code": "502", "char": "GT" }, { "name": "Guernsey", "code": "44", "char": "GG" }, { "name": "Guinea", "code": "224", "char": "GN" }, { "name": "Guinea-Bissau", "code": "245", "char": "GW" }, { "name": "Guyana", "code": "592", "char": "GY" }, { "name": "Haiti", "code": "509", "char": "HT" }, { "name": "Holy See", "code": "379", "char": "VA" }, { "name": "Honduras", "code": "504", "char": "HN" }, { "name": "Hong Kong", "code": "852", "char": "HK" }, { "name": "Hungary", "code": "36", "char": "HU" }, { "name": "Iceland", "code": "354", "char": "IS" }, { "name": "India", "code": "91", "char": "IN" }, { "name": "Indonesia", "code": "62", "char": "ID" }, { "name": "Ivory Coast", "code": "225", "char": "CI" }, { "name": "Iran", "code": "98", "char": "IR" }, { "name": "Iraq", "code": "964", "char": "IQ" }, { "name": "Isle of Man", "code": "44", "char": "IM" }, { "name": "Israel", "code": "972", "char": "IL" }, { "name": "Italy", "code": "39", "char": "IT" }, { "name": "Jamaica", "code": "1876", "char": "JM" }, { "name": "Japan", "code": "81", "char": "JP" }, { "name": "Jersey", "code": "44", "char": "JE" }, { "name": "Jordan", "code": "962", "char": "JO" }, { "name": "Kazakhstan", "code": "76", "char": "KZ" }, { "name": "Kenya", "code": "254", "char": "KE" }, { "name": "Kiribati", "code": "686", "char": "KI" }, { "name": "Kuwait", "code": "965", "char": "KW" }, { "name": "Kyrgyzstan", "code": "996", "char": "KG" }, { "name": "Laos", "code": "856", "char": "LA" }, { "name": "Latvia", "code": "371", "char": "LV" }, { "name": "Lebanon", "code": "961", "char": "LB" }, { "name": "Lesotho", "code": "266", "char": "LS" }, { "name": "Liberia", "code": "231", "char": "LR" }, { "name": "Libya", "code": "218", "char": "LY" }, { "name": "Liechtenstein", "code": "423", "char": "LI" }, { "name": "Lithuania", "code": "370", "char": "LT" }, { "name": "Luxembourg", "code": "352", "char": "LU" }, { "name": "Macau", "code": "853", "char": "MO" }, { "name": "Madagascar", "code": "261", "char": "MG" }, { "name": "Malawi", "code": "265", "char": "MW" }, { "name": "Malaysia", "code": "60", "char": "MY" }, { "name": "Maldives", "code": "960", "char": "MV" }, { "name": "Mali", "code": "223", "char": "ML" }, { "name": "Malta", "code": "356", "char": "MT" }, { "name": "Marshall Islands", "code": "692", "char": "MH" }, { "name": "Martinique", "code": "596", "char": "MQ" }, { "name": "Mauritania", "code": "222", "char": "MR" }, { "name": "Mauritius", "code": "230", "char": "MU" }, { "name": "Mayotte", "code": "262", "char": "YT" }, { "name": "Mexico", "code": "52", "char": "MX" }, { "name": "Moldova", "code": "373", "char": "MD" }, { "name": "Monaco", "code": "377", "char": "MC" }, { "name": "Mongolia", "code": "976", "char": "MN" }, { "name": "Montenegro", "code": "382", "char": "ME" }, { "name": "Montserrat", "code": "1664", "char": "MS" }, { "name": "Morocco", "code": "212", "char": "MA" }, { "name": "Mozambique", "code": "258", "char": "MZ" }, { "name": "Myanmar", "code": "95", "char": "MM" }, { "name": "Namibia", "code": "264", "char": "NA" }, { "name": "Nauru", "code": "674", "char": "NR" }, { "name": "Nepal", "code": "977", "char": "NP" }, { "name": "Netherlands", "code": "31", "char": "NL" }, { "name": "New Caledonia", "code": "687", "char": "NC" }, { "name": "New Zealand", "code": "64", "char": "NZ" }, { "name": "Nicaragua", "code": "505", "char": "NI" }, { "name": "Niger", "code": "227", "char": "NE" }, { "name": "Nigeria", "code": "234", "char": "NG" }, { "name": "Niue", "code": "683", "char": "NU" }, { "name": "Norfolk Island", "code": "672", "char": "NF" }, { "name": "North Korea", "code": "850", "char": "KP" }, { "name": "Northern Mariana Islands", "code": "1670", "char": "MP" }, { "name": "Norway", "code": "47", "char": "NO" }, { "name": "Oman", "code": "968", "char": "OM" }, { "name": "Pakistan", "code": "92", "char": "PK" }, { "name": "Palau", "code": "680", "char": "PW" }, { "name": "Palestine", "code": "970", "char": "PS" }, { "name": "Panama", "code": "507", "char": "PA" }, { "name": "Papua New Guinea", "code": "675", "char": "PG" }, { "name": "Paraguay", "code": "595", "char": "PY" }, { "name": "Peru", "code": "51", "char": "PE" }, { "name": "Philippines", "code": "63", "char": "PH" }, { "name": "Pitcairn Islands", "code": "64", "char": "PN" }, { "name": "Poland", "code": "48", "char": "PL" }, { "name": "Portugal", "code": "351", "char": "PT" }, { "name": "Puerto Rico", "code": "1787", "char": "PR" }, { "name": "Qatar", "code": "974", "char": "QA" }, { "name": "Republic of the Congo", "code": "242", "char": "CG" }, { "name": "Republic of Ireland", "code": "353", "char": "IE" }, { "name": "Republic of Macedonia", "code": "389", "char": "MK" }, { "name": "Republic of Kosovo", "code": "383", "char": "XK" }, { "name": "Réunion", "code": "262", "char": "RE" }, { "name": "Romania", "code": "40", "char": "RO" }, { "name": "Russia", "code": "7", "char": "RU" }, { "name": "Rwanda", "code": "250", "char": "RW" }, { "name": "Saint Barthélemy", "code": "590", "char": "BL" }, { "name": "Saint Helena", "code": "290", "char": "SH" }, { "name": "Saint Kitts and Nevis", "code": "1869", "char": "KN" }, { "name": "Saint Lucia", "code": "1758", "char": "LC" }, { "name": "Saint Martin", "code": "590", "char": "MF" }, { "name": "Saint Pierre and Miquelon", "code": "508", "char": "PM" }, { "name": "Saint Vincent and the Grenadines", "code": "1784", "char": "VC" },
    { "name": "Samoa", "code": "685", "char": "WS" }, { "name": "San Marino", "code": "378", "char": "SM" }, { "name": "São Tomé and Príncipe", "code": "239", "char": "ST" }, { "name": "Saudi Arabia", "code": "966", "char": "SA" }, { "name": "Senegal", "code": "221", "char": "SN" }, { "name": "Serbia", "code": "381", "char": "RS" }, { "name": "Seychelles", "code": "248", "char": "SC" }, { "name": "Sierra Leone", "code": "232", "char": "SL" }, { "name": "Singapore", "code": "65", "char": "SG" }, { "name": "Sint Maarten", "code": "1721", "char": "SX" }, { "name": "Slovakia", "code": "421", "char": "SK" }, { "name": "Slovenia", "code": "386", "char": "SI" }, { "name": "Solomon Islands", "code": "677", "char": "SB" }, { "name": "Somalia", "code": "252", "char": "SO" }, { "name": "South Africa", "code": "27", "char": "ZA" }, { "name": "South Georgia", "code": "500", "char": "GS" }, { "name": "South Korea", "code": "82", "char": "KR" }, { "name": "South Sudan", "code": "211", "char": "SS" }, { "name": "Spain", "code": "34", "char": "ES" }, { "name": "Sri Lanka", "code": "94", "char": "LK" }, { "name": "Sudan", "code": "249", "char": "SD" }, { "name": "Suriname", "code": "597", "char": "SR" }, { "name": "Svalbard and Jan Mayen", "code": "4779", "char": "SJ" }, { "name": "Swaziland", "code": "268", "char": "SZ" }, { "name": "Sweden", "code": "46", "char": "SE" }, { "name": "Switzerland", "code": "41", "char": "CH" }, { "name": "Syria", "code": "963", "char": "SY" }, { "name": "The Bahamas", "code": "1242", "char": "BS" }, { "name": "The Gambia", "code": "220", "char": "GM" }, { "name": "Taiwan", "code": "886", "char": "TW" }, { "name": "Tajikistan", "code": "992", "char": "TJ" }, { "name": "Tanzania", "code": "255", "char": "TZ" }, { "name": "Thailand", "code": "66", "char": "TH" }, { "name": "Togo", "code": "228", "char": "TG" }, { "name": "Tokelau", "code": "690", "char": "TK" }, { "name": "Tonga", "code": "676", "char": "TO" }, { "name": "Trinidad and Tobago", "code": "1868", "char": "TT" }, { "name": "Tunisia", "code": "216", "char": "TN" }, { "name": "Turkey", "code": "90", "char": "TR" }, { "name": "Turkmenistan", "code": "993", "char": "TM" }, { "name": "Turks and Caicos Islands", "code": "1649", "char": "TC" }, { "name": "Tuvalu", "code": "688", "char": "TV" }, { "name": "Uganda", "code": "256", "char": "UG" }, { "name": "Ukraine", "code": "380", "char": "UA" }, { "name": "United Arab Emirates", "code": "971", "char": "AE" }, { "name": "United Kingdom", "code": "44", "char": "GB" }, { "name": "United States", "code": "1", "char": "US" }, { "name": "Uruguay", "code": "598", "char": "UY" }, { "name": "Uzbekistan", "code": "998", "char": "UZ" }, { "name": "Virgin Islands (British)", "code": "1284", "char": "VG" }, { "name": "Virgin Islands (U.S.)", "code": "1 340", "char": "VI" }, { "name": "Vanuatu", "code": "678", "char": "VU" }, { "name": "Venezuela", "code": "58", "char": "VE" }, { "name": "Vietnam", "code": "84", "char": "VN" }, { "name": "Wallis and Futuna", "code": "681", "char": "WF" }, { "name": "Western Sahara", "code": "212", "char": "EH" }, { "name": "Yemen", "code": "967", "char": "YE" }, { "name": "Zambia", "code": "260", "char": "ZM" }, { "name": "Zimbabwe", "code": "263", "char": "ZW" }, { "name": "Åland Islands", "code": "358", "char": "AX" }];

    clinic_staff = [{ label: 'Select Provider', value: null }];
    constructor(
        public router: Router,
        private formBuilder: FormBuilder,
        private signUpService: SignUpService,
        private alertService: MessageService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute

    ) {
        let password = new FormControl('', [Validators.required, Validators.maxLength(appConfig.password.maxLength), Validators.minLength(appConfig.password.minLength)]);
        let repassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)])
        this.signUpForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(appConfig.pattern.MAXLENGTH), Validators.minLength(appConfig.pattern.MINLENGTH), Validators.pattern(appConfig.pattern.NAME)]],
            lastName: ['', [Validators.required, Validators.maxLength(appConfig.pattern.MAXLENGTH), Validators.minLength(appConfig.pattern.MINLENGTH), Validators.pattern(appConfig.pattern.NAME)]],
            email: ['', [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]],
            address: ['', [Validators.required, Validators.pattern(appConfig.pattern.DESCRIPTION)]],
            mobileNumber: ["", [Validators.maxLength(15), Validators.pattern(appConfig.pattern.MOB_NO)]],
            password: password,
            userType: ['user', [Validators.required]],
            repassword: repassword,
            legalCorporateName: [''],
            clinicName: [''],
            associated_clinic_id: ['', [Validators.required]],
            associated_staff_id: [''],    
            associatedClinicName: [''],
            genrate: [false],
            needVerify: [true],
            countryCode: [{ name: "United States", code: "1", char: "US" }],
            mobileNumberCode : [''],
            category : [''],
            termsAndCondition: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.getClinicCategoryListing();
        this.onSelectCode('');
        this.clinics = [
            { label: 'Select clinic', value: null }
        ];

        const userType = this.signUpForm.get('userType');
        const needToverify = this.signUpForm.get('needVerify');
        if (userType.value == 'user') {
            needToverify.setValue(false);
        }

        if (this.router.url != '/signup') {
            this.activatedRoute.params.subscribe((param: any) => {
                if (this.activatedRoute.snapshot.params.user_id) {
                    let str = '/login/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id + '/' + this.activatedRoute.snapshot.params.user_id;
                    this.hideLogin = true
                    this.router.navigateByUrl(str);
                }
                if (this.activatedRoute.snapshot.params.clinic_id && this.activatedRoute.snapshot.params.survey_id) {
                    this.hideLogin = true
                    this.isUrl = true;
                    this.signUpService.fillQuestionnaire(this.activatedRoute.snapshot.params.clinic_id).subscribe((result: any) => {
                        if (result && result.code == 200 && result.data) {
                            this.clinicDetail = result.data;
                            this.clinics = [
                                { label: this.clinicDetail[0].clinicName, value: this.clinicDetail._id }
                            ];
                            this.placeHolderString = this.clinicDetail[0].clinicName
                            this.signUpForm.patchValue({
                                associatedClinicName: this.clinicDetail[0].clinicName,
                                associated_clinic_id: this.clinicDetail[0]._id,
                                needVerify: false
                            })
                            this.isReadOnly = true;
                           
                        } else {
                            this.isReadOnly = false;
                            
                        }
                    });
                }
            });
        }


    }
    getClinicCategoryListing() {
        let dummyData = "demo";
        this.signUpService.getClinicCategoryListing(dummyData)
          .subscribe((res: any) => {
            this.isLoading = false;
            if (res.code == 200) {
              this.clinicCategoryList = res.data ? res.data : this.clinicCategoryList;
            } else {
              this.toastr.error(res.message);
            }
            /*if(res.data.length && res.code == 200){
              for(let i=0; i<res.data.length; i++){
                let obj = {
                  label: res.data[i].name,
                  value: res.data[i]._id
                }
                this.clinicCategoryList.push(obj);
              }
          }*/
      });
    }

    onSelectCode(str) {
        let code = this.signUpForm.get('countryCode').value;
        this.signUpForm.patchValue({
            mobileNumberCode : "+"+ code.code
        })
        code = code.code;
    }

    onUserTypeChange() {
        this.reset();
        const clinicNameControl = this.signUpForm.get('clinicName');
        const legalCorporateName = this.signUpForm.get('legalCorporateName');
        const associatedClinicId = this.signUpForm.get('associated_clinic_id');
        const controlAssociatedClinicName = this.signUpForm.get('associatedClinicName');
        const controlAssociatedStaffId = this.signUpForm.get('associated_staff_id');  
        const userControl = this.signUpForm.get('userType');
        const address = this.signUpForm.get('address');
        if (userControl.value == 'user') {
            this.showClinic = false;
            controlAssociatedClinicName.clearValidators();
            controlAssociatedClinicName.updateValueAndValidity();
            clinicNameControl.clearValidators();
            clinicNameControl.updateValueAndValidity();
            legalCorporateName.clearValidators();
            legalCorporateName.updateValueAndValidity();
            associatedClinicId.setValidators([Validators.required]);
            associatedClinicId.updateValueAndValidity();
            address.clearValidators();
            address.updateValueAndValidity();
        } else if (userControl.value == 'clinic') {
            this.showClinic = true;
            this.getClinicStaffListStatus = false;
            controlAssociatedClinicName.clearValidators();
            controlAssociatedClinicName.updateValueAndValidity();
            clinicNameControl.setValidators([Validators.required, Validators.maxLength(appConfig.pattern.CLINICNAMELENGTH), Validators.minLength(appConfig.pattern.MINLENGTH), Validators.pattern(appConfig.pattern.NAME)]);
            clinicNameControl.updateValueAndValidity();
            legalCorporateName.setValidators([Validators.required, Validators.maxLength(appConfig.pattern.CLINICNAMELENGTH), Validators.minLength(appConfig.pattern.MINLENGTH), Validators.pattern(appConfig.pattern.NAME)]);
            legalCorporateName.updateValueAndValidity();
            address.setValidators([Validators.required, Validators.pattern(appConfig.pattern.DESCRIPTION)]);
            address.updateValueAndValidity();
            associatedClinicId.clearValidators();
            associatedClinicId.updateValueAndValidity();
            controlAssociatedStaffId.clearValidators();             
            controlAssociatedStaffId.updateValueAndValidity();    
        } else {
            this.showClinic = false;
        }
    }

    register() {
        this.isLoading = true;
        const userControl = this.signUpForm.get('userType');
        if (userControl.value == "clinic") {
            this.signUpForm.patchValue({
                associatedClinicName: "",
                associated_clinic_id: "",
                genrate: false,
            })

        } else {
            let mob = this.signUpForm.get('mobileNumber').value;
            let code = this.signUpForm.get('mobileNumberCode').value;
             this.signUpForm.patchValue({
                    mobileNumber: code + mob
                })
            if (code = "") {
                this.onSelectCode(code);
            }
            let temp = this.signUpForm.get('associated_clinic_id').value;
            if (temp && temp.label && temp.value) {
                this.signUpForm.patchValue({
                    associatedClinicName: temp.label,
                    associated_clinic_id: temp.value,
                    category: temp.category,
                    genrate: false
                })
            } else {
                if (this.isUrl) {
                    this.signUpForm.patchValue({
                        genrate: false,
                        associated_staff_id: this.clinic_provider_id
                    })
                } else {
                    this.signUpForm.patchValue({
                        associatedClinicName: temp,    
                        associated_clinic_id: "idNeedToBeGiven",
                        genrate: true,
                    })
                }
            }
        }
        let tempObj = this.signUpForm.value;
        if (this.isUrl) {
            tempObj.clinic_id = this.activatedRoute.snapshot.params.clinic_id;
            tempObj.survey_id = this.activatedRoute.snapshot.params.survey_id;
            tempObj.isUrl = this.isUrl;
        }
        this.signUpService.userRegistration(tempObj).subscribe((result: any) => {
            this.isLoading = false;
            if (result && result.code == 200) {
                this.createUserForTwilio(result);
                this.successEmail = this.signUpForm.get('email').value;
                if (this.isUrl) {
                    this.showWelcome = false;
                    let str;
                    str = '/login/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id
                    this.router.navigateByUrl(str);
                } else {
                    if (result.data.userType == appConfig.userType.USER) {
                        this.showWelcome = false;
                        this.router.navigate(['/login']);
                    }
                    else {
                        this.showWelcome = true;
                    }
                }

                if (result.message) {
                    this.toastr.success(result.message);
                } else {
                    this.toastr.success("Registration successfull");
                }

            } else if (result && result.code == 402) {
                this.toastr.info(result.message);
            } else if (result && result.code == 500) {
                this.toastr.error(result.message);
            } else {
                if (result.message) {
                    this.toastr.error(result.message);
                } else {
                    this.toastr.error("Something went wrong");
                }
            }
        })
    }

    createUserForTwilio(userDetails) {
        let data = {
            identity: userDetails.data._id,
            friendlyName: userDetails.data.userName
        }
        this.signUpService.createUserForTwilio(data).subscribe((result: any) => {
        })

    }

    generalClinicListing(event) {
        var data = {
            "count": this.count,
            "page": this.page,
            "searchText": event.query ? event.query : '',
        }
        this.signUpService.getGeneralClinicListing(data).subscribe((result: any) => {
            const controlAssociatedClinicName = this.signUpForm.get('associatedClinicName');
            const controlAssociatedStaffId = this.signUpForm.get('associated_staff_id');  
            if (result && result.code == 200 && result.data) {
               
                this.clinics = [];
                if (result.data.length) {
                    this.showInputBox = false;
                    this.getClinicStaffListStatus = true;
                    for (var i = 0; i < result.data.length; i++) {
                        var item = {
                            label: result.data[i].clinicName,
                            value: result.data[i]._id,
                            category: result.data[i].category
                        }
                        this.clinics.push(item);
                    }
                    controlAssociatedClinicName.clearValidators();
                    controlAssociatedClinicName.updateValueAndValidity();

                } else {
                    controlAssociatedClinicName.clearValidators();           
                    controlAssociatedClinicName.updateValueAndValidity();
                    controlAssociatedStaffId.clearValidators();             
                    controlAssociatedStaffId.updateValueAndValidity();      
                    this.showInputBox = false;     
                    this.getClinicStaffListStatus = false;
                    this.signUpForm.patchValue({
                        genrate: true
                    })

                }
            } else if (result && result.code == 402) {
                this.toastr.info(result.message);
            } else if (result && result.code == 500) {
                this.toastr.error(result.message);
            }
        })
    }

    getClinicStaffList(event) {
        const controlAssociatedStaffId = this.signUpForm.get('associated_staff_id');

        let obj = { _id: event.value }
        this.clinic_staff = [{ label: 'Select Provider', value: null }];
        this.signUpService.getClinicStaffList(obj).subscribe((result: any) => {
            if (result.data.length) {
                controlAssociatedStaffId.setValidators([Validators.required]);
                controlAssociatedStaffId.updateValueAndValidity();
                for (let i = 0; i < result.data.length; i++) {
                    let item = {
                        label: result.data[i].userName,
                        value: result.data[i]._id
                    }
                    this.clinic_staff.push(item);
                }
            } else {
                controlAssociatedStaffId.clearValidators();
                controlAssociatedStaffId.updateValueAndValidity();
                this.getClinicStaffListStatus = false;
            }
        })
    }

    selectProvider(event) {
        this.clinic_provider_id = event.value;
    }

    reset() {
        this.signUpForm.patchValue({
            firstName: '',
            lastName: '',
            email: '',
            mobileNumber: '',
            password: '',
            repassword: '',
            clinicName: '',
            associated_clinic_id: '',
            associatedClinicName: '',
            termsAndCondition: '',
            genrate: false,
        });
        this.signUpForm.markAsPristine();
       
    }
    redirect() {
        let str;
        if (this.activatedRoute.snapshot.params.user_id) {
            str = '/login/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id + '/' + this.activatedRoute.snapshot.params.user_id;
        } else {
            str = '/login/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id
        }
        this.router.navigateByUrl(str);
    }
    orValidation(str) {
        const emailControl = this.signUpForm.get('email');
        const mobileControl = this.signUpForm.get('mobileNumber');
        if (str === "email") {
            emailControl.setValidators([Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]);
            emailControl.updateValueAndValidity();
            mobileControl.clearValidators();
            mobileControl.setValidators([Validators.pattern(appConfig.pattern.MOB_NO)]);
           
            mobileControl.updateValueAndValidity();

        }
        if (str === "mobile") {
            if (this.signUpForm.get('email').value) {
                mobileControl.setValidators([Validators.pattern(appConfig.pattern.MOB_NO)]);
                mobileControl.updateValueAndValidity();
            } else {
                emailControl.markAsPristine();
                emailControl.setValidators([Validators.pattern(appConfig.pattern.EMAIL)]);;
                emailControl.updateValueAndValidity();
                mobileControl.setValidators([Validators.maxLength(15), Validators.required, Validators.pattern(appConfig.pattern.MOB_NO)]);
                mobileControl.updateValueAndValidity();
            }
        }
    }

    onChange(event) {
        if (event) {
            const address = this.signUpForm.get('address');
            const userControl = this.signUpForm.get('userType');
            if (userControl.value == 'user') {
                address.clearValidators();
                address.updateValueAndValidity();
            }
            this.signUpForm.value.termsAndCondition = event
        } else {
            this.signUpForm.value.termsAndCondition = null;
        }
    }

    showTermsDialogue() {
        const userControl = this.signUpForm.get('userType');
        if (userControl.value == 'user') {
            this.displayTermsUser = true;
            this.displayTermsClinic = false;
        } else if (userControl.value == 'clinic') {
            this.displayTermsClinic = true;
            this.displayTermsUser = false;
        } else {
            this.displayTermsClinic = false;
            this.displayTermsUser = false;
        }
    }

    closeTermsDialogue() {
        this.displayTermsClinic = false;
        this.displayTermsUser = false;
    }
}
