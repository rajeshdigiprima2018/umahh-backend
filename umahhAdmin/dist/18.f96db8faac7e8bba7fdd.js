(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{YrUf:function(n,l,o){"use strict";o.r(l);var u=o("CcnG"),t=function(){},e=o("pMnS"),r=o("Ip0R"),i=o("gIcY"),a=o("ZYCi"),d=o("e/U5"),s=function(){function n(n,l,o){this.router=n,this.loginService=l,this.formBuilder=o,console.log("..login component.....................first")}return n.prototype.ngOnInit=function(){this.loginForm=this.formBuilder.group({email:["",[i.Validators.required]],password:["",[i.Validators.required]],practice_id:[""],practice_name:[""]})},n.prototype.login=function(){var n=this;console.log(this.loginForm),this.loginForm.invalid&&Object.keys(this.loginForm.controls).forEach(function(l){n.loginForm.controls[l].markAsDirty()})},n}(),g=u["\u0275crt"]({encapsulation:0,styles:[["[_nghost-%COMP%]{display:block}.login-page[_ngcontent-%COMP%]{position:absolute;top:0;left:0;right:0;bottom:0;overflow:auto;background:#222;text-align:center;color:#fff;padding:3em}.login-page[_ngcontent-%COMP%]   .col-lg-4[_ngcontent-%COMP%]{padding:0}.login-page[_ngcontent-%COMP%]   .input-lg[_ngcontent-%COMP%]{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:0}.login-page[_ngcontent-%COMP%]   .input-underline[_ngcontent-%COMP%]{background:0 0;border:none;box-shadow:none;border-bottom:2px solid rgba(255,255,255,.5);color:#fff;border-radius:0}.login-page[_ngcontent-%COMP%]   .input-underline[_ngcontent-%COMP%]:focus{border-bottom:2px solid #fff;box-shadow:none}.login-page[_ngcontent-%COMP%]   .rounded-btn[_ngcontent-%COMP%]{border-radius:50px;color:rgba(255,255,255,.8);background:#222;border:2px solid rgba(255,255,255,.8);font-size:18px;line-height:40px;padding:0 25px}.login-page[_ngcontent-%COMP%]   .rounded-btn[_ngcontent-%COMP%]:active, .login-page[_ngcontent-%COMP%]   .rounded-btn[_ngcontent-%COMP%]:focus, .login-page[_ngcontent-%COMP%]   .rounded-btn[_ngcontent-%COMP%]:hover, .login-page[_ngcontent-%COMP%]   .rounded-btn[_ngcontent-%COMP%]:visited{color:#fff;border:2px solid #fff;outline:0}.login-page[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-weight:300;margin-top:20px;margin-bottom:10px;font-size:36px}.login-page[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:rgba(255,255,255,.7)}.login-page[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]{padding:8px 0}.login-page[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::-webkit-input-placeholder{color:rgba(255,255,255,.6)!important}.login-page[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:-moz-placeholder{color:rgba(255,255,255,.6)!important}.login-page[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::-moz-placeholder{color:rgba(255,255,255,.6)!important}.login-page[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:-ms-input-placeholder{color:rgba(255,255,255,.6)!important}.login-page[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]{padding:40px 0}.login-page[_ngcontent-%COMP%]   .user-avatar[_ngcontent-%COMP%]{border-radius:50%;border:2px solid #fff}.login-page[_ngcontent-%COMP%]   .ui-autocomplete[_ngcontent-%COMP%]   .ui-autocomplete-input[_ngcontent-%COMP%]{font-size:18px!important}"]],data:{}});function c(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"p",[["class","form_error"]],null,null,null,null,null)),(n()(),u["\u0275ted"](-1,null,["Please enter email address or username."]))],null,null)}function p(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,2,"div",[],null,null,null,null,null)),(n()(),u["\u0275and"](16777216,null,null,1,null,c)),u["\u0275did"](2,16384,null,0,r.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(n,l){n(l,2,0,l.component.loginForm.controls.email.hasError("required"))},null)}function m(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"p",[["class","form_error"]],null,null,null,null,null)),(n()(),u["\u0275ted"](-1,null,["Please enter Password."]))],null,null)}function f(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,2,"div",[],null,null,null,null,null)),(n()(),u["\u0275and"](16777216,null,null,1,null,m)),u["\u0275did"](2,16384,null,0,r.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(n,l){n(l,2,0,l.component.loginForm.controls.password.hasError("required"))},null)}function C(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,41,"div",[["class","login-page"]],null,null,null,null,null)),(n()(),u["\u0275eld"](1,0,null,null,40,"div",[["class","row justify-content-md-center"]],null,null,null,null,null)),(n()(),u["\u0275eld"](2,0,null,null,39,"div",[["class","col-md-4"]],null,null,null,null,null)),(n()(),u["\u0275eld"](3,0,null,null,0,"img",[["class","user-avatar"],["src","assets/images/logo.png"],["width","150px"]],null,null,null,null,null)),(n()(),u["\u0275eld"](4,0,null,null,1,"h1",[],null,null,null,null,null)),(n()(),u["\u0275ted"](-1,null,["Admin"])),(n()(),u["\u0275eld"](6,0,null,null,4,"div",[["class","input-group mb-3 inputTI"]],null,null,null,null,null)),(n()(),u["\u0275eld"](7,0,null,null,2,"div",[["class","input-group-prepend"]],null,null,null,null,null)),(n()(),u["\u0275eld"](8,0,null,null,1,"span",[["class","input-group-text"],["id","basic-addon1"]],null,null,null,null,null)),(n()(),u["\u0275eld"](9,0,null,null,0,"i",[["class","fa fa-hospital-o"]],null,null,null,null,null)),(n()(),u["\u0275eld"](10,0,null,null,0,"input",[["aria-describedby","basic-addon1"],["aria-label","Username"],["class","form-control"],["placeholder","Clinic name"],["type","text"]],null,null,null,null,null)),(n()(),u["\u0275eld"](11,0,null,null,30,"form",[["method","post"],["novalidate",""],["role","form"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"submit"],[null,"reset"]],function(n,l,o){var t=!0;return"submit"===l&&(t=!1!==u["\u0275nov"](n,13).onSubmit(o)&&t),"reset"===l&&(t=!1!==u["\u0275nov"](n,13).onReset()&&t),t},null,null)),u["\u0275did"](12,16384,null,0,i["\u0275angular_packages_forms_forms_bg"],[],null,null),u["\u0275did"](13,540672,null,0,i.FormGroupDirective,[[8,null],[8,null]],{form:[0,"form"]},null),u["\u0275prd"](2048,null,i.ControlContainer,null,[i.FormGroupDirective]),u["\u0275did"](15,16384,null,0,i.NgControlStatusGroup,[[4,i.ControlContainer]],null,null),(n()(),u["\u0275eld"](16,0,null,null,18,"div",[["class","form-content"]],null,null,null,null,null)),(n()(),u["\u0275eld"](17,0,null,null,8,"div",[["class","form-group"]],null,null,null,null,null)),(n()(),u["\u0275eld"](18,0,null,null,5,"input",[["class","form-control input-underline input-lg"],["formControlName","email"],["id",""],["placeholder","Email"],["type","email"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],function(n,l,o){var t=!0;return"input"===l&&(t=!1!==u["\u0275nov"](n,19)._handleInput(o.target.value)&&t),"blur"===l&&(t=!1!==u["\u0275nov"](n,19).onTouched()&&t),"compositionstart"===l&&(t=!1!==u["\u0275nov"](n,19)._compositionStart()&&t),"compositionend"===l&&(t=!1!==u["\u0275nov"](n,19)._compositionEnd(o.target.value)&&t),t},null,null)),u["\u0275did"](19,16384,null,0,i.DefaultValueAccessor,[u.Renderer2,u.ElementRef,[2,i.COMPOSITION_BUFFER_MODE]],null,null),u["\u0275prd"](1024,null,i.NG_VALUE_ACCESSOR,function(n){return[n]},[i.DefaultValueAccessor]),u["\u0275did"](21,671744,null,0,i.FormControlName,[[3,i.ControlContainer],[8,null],[8,null],[6,i.NG_VALUE_ACCESSOR],[2,i["\u0275angular_packages_forms_forms_j"]]],{name:[0,"name"]},null),u["\u0275prd"](2048,null,i.NgControl,null,[i.FormControlName]),u["\u0275did"](23,16384,null,0,i.NgControlStatus,[[4,i.NgControl]],null,null),(n()(),u["\u0275and"](16777216,null,null,1,null,p)),u["\u0275did"](25,16384,null,0,r.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),u["\u0275eld"](26,0,null,null,8,"div",[["class","form-group"]],null,null,null,null,null)),(n()(),u["\u0275eld"](27,0,null,null,5,"input",[["class","form-control input-underline input-lg"],["formControlName","password"],["id",""],["placeholder","Password"],["type","password"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],function(n,l,o){var t=!0;return"input"===l&&(t=!1!==u["\u0275nov"](n,28)._handleInput(o.target.value)&&t),"blur"===l&&(t=!1!==u["\u0275nov"](n,28).onTouched()&&t),"compositionstart"===l&&(t=!1!==u["\u0275nov"](n,28)._compositionStart()&&t),"compositionend"===l&&(t=!1!==u["\u0275nov"](n,28)._compositionEnd(o.target.value)&&t),t},null,null)),u["\u0275did"](28,16384,null,0,i.DefaultValueAccessor,[u.Renderer2,u.ElementRef,[2,i.COMPOSITION_BUFFER_MODE]],null,null),u["\u0275prd"](1024,null,i.NG_VALUE_ACCESSOR,function(n){return[n]},[i.DefaultValueAccessor]),u["\u0275did"](30,671744,null,0,i.FormControlName,[[3,i.ControlContainer],[8,null],[8,null],[6,i.NG_VALUE_ACCESSOR],[2,i["\u0275angular_packages_forms_forms_j"]]],{name:[0,"name"]},null),u["\u0275prd"](2048,null,i.NgControl,null,[i.FormControlName]),u["\u0275did"](32,16384,null,0,i.NgControlStatus,[[4,i.NgControl]],null,null),(n()(),u["\u0275and"](16777216,null,null,1,null,f)),u["\u0275did"](34,16384,null,0,r.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),u["\u0275eld"](35,0,null,null,1,"a",[["class","btn btn-primary"]],null,[[null,"click"]],function(n,l,o){var u=!0;return"click"===l&&(u=!1!==n.component.login()&&u),u},null,null)),(n()(),u["\u0275ted"](-1,null,[" Log in "])),(n()(),u["\u0275ted"](-1,null,[" \xa0 "])),(n()(),u["\u0275eld"](38,0,null,null,3,"a",[["class","btn btn-default"]],[[1,"target",0],[8,"href",4]],[[null,"click"]],function(n,l,o){var t=!0;return"click"===l&&(t=!1!==u["\u0275nov"](n,39).onClick(o.button,o.ctrlKey,o.metaKey,o.shiftKey)&&t),t},null,null)),u["\u0275did"](39,671744,null,0,a.o,[a.l,a.a,r.LocationStrategy],{routerLink:[0,"routerLink"]},null),u["\u0275pad"](40,1),(n()(),u["\u0275ted"](-1,null,["Register"]))],function(n,l){var o=l.component;n(l,13,0,o.loginForm),n(l,21,0,"email"),n(l,25,0,o.loginForm.controls.email.dirty&&o.loginForm.controls.email.invalid),n(l,30,0,"password"),n(l,34,0,o.loginForm.controls.password.dirty&&o.loginForm.controls.password.invalid),n(l,39,0,n(l,40,0,"/signup"))},function(n,l){n(l,11,0,u["\u0275nov"](l,15).ngClassUntouched,u["\u0275nov"](l,15).ngClassTouched,u["\u0275nov"](l,15).ngClassPristine,u["\u0275nov"](l,15).ngClassDirty,u["\u0275nov"](l,15).ngClassValid,u["\u0275nov"](l,15).ngClassInvalid,u["\u0275nov"](l,15).ngClassPending),n(l,18,0,u["\u0275nov"](l,23).ngClassUntouched,u["\u0275nov"](l,23).ngClassTouched,u["\u0275nov"](l,23).ngClassPristine,u["\u0275nov"](l,23).ngClassDirty,u["\u0275nov"](l,23).ngClassValid,u["\u0275nov"](l,23).ngClassInvalid,u["\u0275nov"](l,23).ngClassPending),n(l,27,0,u["\u0275nov"](l,32).ngClassUntouched,u["\u0275nov"](l,32).ngClassTouched,u["\u0275nov"](l,32).ngClassPristine,u["\u0275nov"](l,32).ngClassDirty,u["\u0275nov"](l,32).ngClassValid,u["\u0275nov"](l,32).ngClassInvalid,u["\u0275nov"](l,32).ngClassPending),n(l,38,0,u["\u0275nov"](l,39).target,u["\u0275nov"](l,39).href)})}var _=u["\u0275ccf"]("caseadmin-login",s,function(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"caseadmin-login",[],null,null,null,C,g)),u["\u0275did"](1,114688,null,0,s,[a.l,d.a,i.FormBuilder],null,null)],function(n,l){n(l,1,0)},null)},{},{},[]),v=function(){function n(){}return n.prototype.ngOnInit=function(){},n}(),O=u["\u0275crt"]({encapsulation:2,styles:[],data:{}});function b(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"p",[],null,null,null,null,null)),(n()(),u["\u0275ted"](-1,null,[" password forget "]))],null,null)}var h=u["\u0275ccf"]("caseadmin-forgot",v,function(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"caseadmin-forgot",[],null,null,null,b,O)),u["\u0275did"](1,114688,null,0,v,[],null,null)],function(n,l){n(l,1,0)},null)},{},{},[]),M=function(){function n(){}return n.prototype.ngOnInit=function(){},n}(),P=u["\u0275crt"]({encapsulation:2,styles:[],data:{}});function F(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"p",[],null,null,null,null,null)),(n()(),u["\u0275ted"](-1,null,[" forget user "]))],null,null)}var y=u["\u0275ccf"]("caseadmin-forgot-User",M,function(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"caseadmin-forgot-User",[],null,null,null,F,P)),u["\u0275did"](1,114688,null,0,M,[],null,null)],function(n,l){n(l,1,0)},null)},{},{},[]),w=function(){};o.d(l,"CaseAdminLoginModuleNgFactory",function(){return I});var I=u["\u0275cmf"](t,[],function(n){return u["\u0275mod"]([u["\u0275mpd"](512,u.ComponentFactoryResolver,u["\u0275CodegenComponentFactoryResolver"],[[8,[e.a,_,h,y]],[3,u.ComponentFactoryResolver],u.NgModuleRef]),u["\u0275mpd"](4608,r.NgLocalization,r.NgLocaleLocalization,[u.LOCALE_ID,[2,r["\u0275angular_packages_common_common_a"]]]),u["\u0275mpd"](4608,i["\u0275angular_packages_forms_forms_i"],i["\u0275angular_packages_forms_forms_i"],[]),u["\u0275mpd"](4608,i.FormBuilder,i.FormBuilder,[]),u["\u0275mpd"](1073742336,r.CommonModule,r.CommonModule,[]),u["\u0275mpd"](1073742336,a.p,a.p,[[2,a.v],[2,a.l]]),u["\u0275mpd"](1073742336,i["\u0275angular_packages_forms_forms_bb"],i["\u0275angular_packages_forms_forms_bb"],[]),u["\u0275mpd"](1073742336,i.FormsModule,i.FormsModule,[]),u["\u0275mpd"](1073742336,i.ReactiveFormsModule,i.ReactiveFormsModule,[]),u["\u0275mpd"](1073742336,w,w,[]),u["\u0275mpd"](1073742336,t,t,[]),u["\u0275mpd"](1024,a.j,function(){return[[{path:"",component:s},{path:"forgot_password",component:v},{path:"forgot-user",component:M}]]},[])])})}}]);