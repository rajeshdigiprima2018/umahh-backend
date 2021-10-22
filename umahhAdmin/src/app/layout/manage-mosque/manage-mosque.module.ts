import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ManageMosqueRoutingModule } from './/manage-mosque-routing.module';
import { ListCalendarComponent } from './components/calendar/list-calendar/list-calendar.component';
import { AddCalendarComponent } from './components/calendar/add-calendar/add-calendar.component';
import { EditCalendarComponent } from './components/calendar/edit-calendar/edit-calendar.component';
import { ViewCalendarComponent } from './components/calendar/view-calendar/view-calendar.component';
import { EditorModule } from 'primeng/editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
//board model
import { AddBoardComponent } from './components/board/add-board/add-board.component';
import { ListBoardComponent } from './components/board/list-board/list-board.component';
import { EditBoardComponent } from './components/board/edit-board/edit-board.component';
import { ViewBoardComponent } from './components/board/view-board/view-board.component';
//education model
import { AddEducationComponent } from './components/education/add-education/add-education.component';
import { ListEducationComponent } from './components/education/list-education/list-education.component';
import { EditEducationComponent } from './components/education/edit-education/edit-education.component';
import { ViewEducationComponent } from './components/education/view-education/view-education.component';
//suggestion model
import { AddSuggestionComponent } from './components/suggestion/add-suggestion/add-suggestion.component';
import { ListSuggestionComponent } from './components/suggestion/list-suggestion/list-suggestion.component';
import { EditSuggestionComponent } from './components/suggestion/edit-suggestion/edit-suggestion.component';
import { ViewSuggestionComponent } from './components/suggestion/view-suggestion/view-suggestion.component';
//activity model
import { AddActivityComponent } from './components/activity/add-activity/add-activity.component';
import { ListActivityComponent } from './components/activity/list-activity/list-activity.component';
import { EditActivityComponent } from './components/activity/edit-activity/edit-activity.component';
import { ViewActivityComponent } from './components/activity/view-activity/view-activity.component';
//news model
import { AddNewsComponent } from './components/news/add-news/add-news.component';
import { ListNewsComponent } from './components/news/list-news/list-news.component';
import { EditNewsComponent } from './components/news/edit-news/edit-news.component';
import { ViewNewsComponent } from './components/news/view-news/view-news.component';
//association model
import { AddAssociationComponent } from './components/association/add-association/add-association.component';
import { ListAssociationComponent } from './components/association/list-association/list-association.component';
import { EditAssociationComponent } from './components/association/edit-association/edit-association.component';
import { ViewAssociationComponent } from './components/association/view-association/view-association.component';
//prayer model
import { AddPrayerComponent } from './components/prayer/add-prayer/add-prayer.component';
import { ListPrayerComponent } from './components/prayer/list-prayer/list-prayer.component';
import { EditPrayerComponent } from './components/prayer/edit-prayer/edit-prayer.component';
import { ViewPrayerComponent } from './components/prayer/view-prayer/view-prayer.component';

//prayer name model
import { AddPrayerNameComponent } from './components/prayer-name/add-prayer-name/add-prayer-name.component';
import { ListPrayerNameComponent } from './components/prayer-name/list-prayer-name/list-prayer-name.component';
import { EditPrayerNameComponent } from './components/prayer-name/edit-prayer-name/edit-prayer-name.component';
import { ViewPrayerNameComponent } from './components/prayer-name/view-prayer-name/view-prayer-name.component';

//hajj and umrah model
import { AddHajjandumrahComponent } from './components/hajjandumrah/add-hajjandumrah/add-hajjandumrah.component';
import { ListHajjandumrahComponent } from './components/hajjandumrah/list-hajjandumrah/list-hajjandumrah.component';
import { EditHajjandumrahComponent } from './components/hajjandumrah/edit-hajjandumrah/edit-hajjandumrah.component';
import { ViewHajjandumrahComponent } from './components/hajjandumrah/view-hajjandumrah/view-hajjandumrah.component';

//supplication model
import { AddSupplicationComponent } from './components/supplication/add-supplication/add-supplication.component';
import { ListSupplicationComponent } from './components/supplication/list-supplication/list-supplication.component';
import { EditSupplicationComponent } from './components/supplication/edit-supplication/edit-supplication.component';
import { ViewSupplicationComponent } from './components/supplication/view-supplication/view-supplication.component';

//khutba model
import { AddKhutbaComponent } from './components/khutba/add-khutba/add-khutba.component';
import { ListKhutbaComponent } from './components/khutba/list-khutba/list-khutba.component';
import { EditKhutbaComponent } from './components/khutba/edit-khutba/edit-khutba.component';
import { ViewKhutbaComponent } from './components/khutba/view-khutba/view-khutba.component';

//donation model
import { AddDonationComponent } from './components/donation/add-donation/add-donation.component';
import { ListDonationComponent } from './components/donation/list-donation/list-donation.component';
import { EditDonationComponent } from './components/donation/edit-donation/edit-donation.component';
import { ViewDonationComponent } from './components/donation/view-donation/view-donation.component';

//supplication category model
import { AddDonationCategoryComponent } from './components/donation-category/add-donation-category/add-donation-category.component';
import { ListDonationCategoryComponent } from './components/donation-category/list-donation-category/list-donation-category.component';
import { EditDonationCategoryComponent } from './components/donation-category/edit-donation-category/edit-donation-category.component';
import { ViewDonationCategoryComponent } from './components/donation-category/view-donation-category/view-donation-category.component';

//quiz category model
import { AddQuizCategoryComponent } from './components/quiz-category/add-quiz-category/add-quiz-category.component';
import { ListQuizCategoryComponent } from './components/quiz-category/list-quiz-category/list-quiz-category.component';
import { EditQuizCategoryComponent } from './components/quiz-category/edit-quiz-category/edit-quiz-category.component';
import { ViewQuizCategoryComponent } from './components/quiz-category/view-quiz-category/view-quiz-category.component';

//quiz model
import { AddQuizComponent } from './components/quiz/add-quiz/add-quiz.component';
import { ListQuizComponent } from './components/quiz/list-quiz/list-quiz.component';
import { EditQuizComponent } from './components/quiz/edit-quiz/edit-quiz.component';
import { ViewQuizComponent } from './components/quiz/view-quiz/view-quiz.component';

//quiz rule model
import { AddQuizRuleComponent } from './components/quizrule/add-quizrule/add-quizrule.component';
import { ListQuizRuleComponent } from './components/quizrule/list-quizrule/list-quizrule.component';
import { EditQuizRuleComponent } from './components/quizrule/edit-quizrule/edit-quizrule.component';
import { ViewQuizRuleComponent } from './components/quizrule/view-quizrule/view-quizrule.component';

//payment model
import { AddPaymentComponent } from './components/payment/add-payment/add-payment.component';
import { ListPaymentComponent } from './components/payment/list-payment/list-payment.component';
import { EditPaymentComponent } from './components/payment/edit-payment/edit-payment.component';
import { ViewPaymentComponent } from './components/payment/view-payment/view-payment.component';

//Notification model
import { AddNotificationComponent } from './components/notification/add-notification/add-notification.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { EditNotificationComponent } from './components/notification/edit-notification/edit-notification.component';
import { ViewNotificationComponent } from './components/notification/view-notification/view-notification.component';

//Termcondition model
import { AddTermconditionComponent } from './components/termcondition/add-termcondition/add-termcondition.component';
import { ListTermconditionComponent } from './components/termcondition/list-termcondition/list-termcondition.component';
import { EditTermconditionComponent } from './components/termcondition/edit-termcondition/edit-termcondition.component';
import { ViewTermconditionComponent } from './components/termcondition/view-termcondition/view-termcondition.component';

//Message model
import { AddMessageComponent } from './components/message/add-message/add-message.component';
import { ListMessageComponent } from './components/message/list-message/list-message.component';
import { EditMessageComponent } from './components/message/edit-message/edit-message.component';
import { ViewMessageComponent } from './components/message/view-message/view-message.component';

import { DialogModule } from 'primeng/dialog';
import { PaginatorModule} from 'primeng/paginator';
import { FileUploadModule} from 'primeng/fileupload';
import { DragDropModule} from 'primeng/dragdrop';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { PipesModule } from '../../core/pipes/pipes.module';
import { TooltipModule } from 'primeng/tooltip';
import { VideoProcessingService } from './services/video-processing.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DatepickerModule, BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';


//videogular
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { VgImaAdsModule } from 'videogular2/ima-ads';
import { TwoDigitDecimaNumberDirective } from './two-digit-decima-number.directive';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    ManageMosqueRoutingModule,
    TranslateModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    FileUploadModule,
    PaginatorModule,
    DragDropModule,
    TableModule,
    CheckboxModule,
    HttpClientModule, // (Required) for share counts
    HttpClientJsonpModule, // (Optional) For linkedIn & Tumblr counts
    ShareButtonsModule.forRoot(),
    TooltipModule,
    PdfViewerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgImaAdsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot()
  ],

  declarations: [
        ListCalendarComponent,
        AddCalendarComponent,
        EditCalendarComponent,
        AddBoardComponent,
        ListBoardComponent,
        EditBoardComponent,
        ViewCalendarComponent,
        ViewBoardComponent,
        AddEducationComponent,
        ListEducationComponent,
        EditEducationComponent,
        ViewEducationComponent,
        AddSuggestionComponent,
        ListSuggestionComponent,
        EditSuggestionComponent,
        ViewSuggestionComponent,
        AddActivityComponent,
        ListActivityComponent,
        EditActivityComponent,
        ViewActivityComponent,
        AddNewsComponent,
        ListNewsComponent,
        EditNewsComponent,
        ViewNewsComponent,
        AddAssociationComponent,
        ListAssociationComponent,
        EditAssociationComponent,
        ViewAssociationComponent,
        AddPrayerComponent,
        ListPrayerComponent,
        EditPrayerComponent,
        ViewPrayerComponent,
        AddHajjandumrahComponent,
        ListHajjandumrahComponent,
        EditHajjandumrahComponent,
        ViewHajjandumrahComponent,
        AddSupplicationComponent,
        ListSupplicationComponent,
        EditSupplicationComponent,
        ViewSupplicationComponent,
        AddKhutbaComponent,
        ListKhutbaComponent,
        EditKhutbaComponent,
        ViewKhutbaComponent,
        AddDonationComponent,
        ListDonationComponent,
        EditDonationComponent,
        ViewDonationComponent,
        AddDonationCategoryComponent,
        ListDonationCategoryComponent,
        EditDonationCategoryComponent,
        ViewDonationCategoryComponent,
        AddQuizCategoryComponent,
        ListQuizCategoryComponent,
        EditQuizCategoryComponent,
        ViewQuizCategoryComponent,
        AddQuizComponent,
        ListQuizComponent,
        EditQuizComponent,
        ViewQuizRuleComponent,
        AddQuizRuleComponent,
        ListQuizRuleComponent,
        EditQuizRuleComponent,
        ViewQuizComponent,
        AddPaymentComponent,
        ListPaymentComponent,
        EditPaymentComponent,
        ViewPaymentComponent,
        AddNotificationComponent,
        ListNotificationComponent,
        EditNotificationComponent,
        ViewNotificationComponent,
        AddMessageComponent,
        ListMessageComponent,
        EditMessageComponent,
        ViewMessageComponent,
        AddPrayerNameComponent,
        ListPrayerNameComponent,
        EditPrayerNameComponent,
        ViewPrayerNameComponent,
        AddTermconditionComponent,
        ListTermconditionComponent,
        EditTermconditionComponent,
        ViewTermconditionComponent,
        TwoDigitDecimaNumberDirective

      ],
  providers:[VideoProcessingService,BsDatepickerConfig]
})
export class ManageMosqueModule { }
