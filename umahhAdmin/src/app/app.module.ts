import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from "primeng/components/common/shared";

import { FormGroup, FormControl, FormBuilder, Validators, NgForm ,ReactiveFormsModule} from "@angular/forms";
// import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { Ng2Webstorage } from 'ngx-webstorage';
import { LoginService } from './login/services/login.service';

// import { CaseAdminLoginComponent } from "./admin/modules/login/component/login.component";
import { EmailverifyComponent } from "./email_verify/email_verify.component";
import { HomeComponent } from "./home_page/home_page.component";

//Services
import { httpClient } from './core/http.client';
import { WebStorage } from './core/web.storage';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppState } from './app.service';
import { MessageService } from 'primeng/components/common/messageservice';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { OwlModule } from 'ngx-owl-carousel';
import { CommonService } from './core/commonService';
import { ConfirmationService } from 'primeng/components/common/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastrModule } from 'ngx-toastr';
import { SharedService } from './shared.service';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { PaginatorModule } from 'primeng/paginator';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { PipesModule } from './core/pipes/pipes.module';
import { FooterComponent } from './footer/footer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularFireModule } from '@angular/fire';
import { AdsenseModule } from 'ng2-adsense';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { appConfig } from './core/app.config';
import { ContactComponent } from './contact/contact.component';
import { ExportAsModule } from 'ngx-export-as';
import {NgxPrintModule} from 'ngx-print';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DataService } from './login/services/data.service';
// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-angular/CaseMangement/master/dist/assets/i18n/',
        '.json'
    ); */
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        Ng2Webstorage,
        AccordionModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        OwlModule,
        PaginatorModule,
        MDBBootstrapModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        SharedModule,
        ToastrModule.forRoot(),
        HttpClientModule, // (Required) for share counts
        HttpClientJsonpModule, // (Optional) For linkedIn & Tumblr counts
        ShareButtonsModule.forRoot(),
        PipesModule,
        PdfViewerModule,
        AdsenseModule.forRoot({
            adClient: 'ca-pub-7640562161899788',
            adSlot: 7259870550,
          }),
        ExportAsModule,
        NgxPrintModule,
        BsDatepickerModule.forRoot()
        // AngularFireModule.initializeApp(appConfig.firebase)
    ],
    declarations: [
        AppComponent,
        EmailverifyComponent,
        HomeComponent,
        SideNavBarComponent,
        FooterComponent,
        ContactComponent
    ],
    providers: [
        AuthGuard,
        httpClient,
        WebStorage,
        LoginService,
        AppState,
        MessageService,
        CommonService,
        SharedService,
        ConfirmationService,
        {
            provide : HTTP_INTERCEPTORS ,
            useClass : httpClient ,
            multi :true
        },
        AngularFireAuth,
        DataService,
        BsDatepickerConfig
    ],

    bootstrap: [AppComponent]
})
export class AppModule {
    /**
       * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
       * This is good to prevent injecting the service as constructor parameter.
    */
    static injector: Injector;
    constructor(public appState: AppState, injector: Injector) {
        AppModule.injector = injector;
    }
}
