import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCalendarComponent } from './components/calendar/list-calendar/list-calendar.component';
import { Routes, RouterModule } from '@angular/router';
import { AddCalendarComponent } from './components/calendar/add-calendar/add-calendar.component';
import { EditCalendarComponent } from './components/calendar/edit-calendar/edit-calendar.component';
import { ViewCalendarComponent } from './components/calendar/view-calendar/view-calendar.component';
//board component
import { ListBoardComponent } from './components/board/list-board/list-board.component';
import { AddBoardComponent } from './components/board/add-board/add-board.component';
import { EditBoardComponent } from './components/board/edit-board/edit-board.component';
import { ViewBoardComponent } from './components/board/view-board/view-board.component';
//education component
import { AddEducationComponent } from './components/education/add-education/add-education.component';
import { ListEducationComponent } from './components/education/list-education/list-education.component';
import { EditEducationComponent } from './components/education/edit-education/edit-education.component';
import { ViewEducationComponent } from './components/education/view-education/view-education.component';
//suggestion component
import { AddSuggestionComponent } from './components/suggestion/add-suggestion/add-suggestion.component';
import { ListSuggestionComponent } from './components/suggestion/list-suggestion/list-suggestion.component';
import { EditSuggestionComponent } from './components/suggestion/edit-suggestion/edit-suggestion.component';
import { ViewSuggestionComponent } from './components/suggestion/view-suggestion/view-suggestion.component';
//activity component
import { AddActivityComponent } from './components/activity/add-activity/add-activity.component';
import { ListActivityComponent } from './components/activity/list-activity/list-activity.component';
import { EditActivityComponent } from './components/activity/edit-activity/edit-activity.component';
import { ViewActivityComponent } from './components/activity/view-activity/view-activity.component';
//news component
import { AddNewsComponent } from './components/news/add-news/add-news.component';
import { ListNewsComponent } from './components/news/list-news/list-news.component';
import { EditNewsComponent } from './components/news/edit-news/edit-news.component';
import { ViewNewsComponent } from './components/news/view-news/view-news.component';
//association component
import { AddAssociationComponent } from './components/association/add-association/add-association.component';
import { ListAssociationComponent } from './components/association/list-association/list-association.component';
import { EditAssociationComponent } from './components/association/edit-association/edit-association.component';
import { ViewAssociationComponent } from './components/association/view-association/view-association.component';
//prayer component
import { AddPrayerComponent } from './components/prayer/add-prayer/add-prayer.component';
import { ListPrayerComponent } from './components/prayer/list-prayer/list-prayer.component';
import { EditPrayerComponent } from './components/prayer/edit-prayer/edit-prayer.component';
import { ViewPrayerComponent } from './components/prayer/view-prayer/view-prayer.component';

//hajj and umrah component
import { AddHajjandumrahComponent } from './components/hajjandumrah/add-hajjandumrah/add-hajjandumrah.component';
import { ListHajjandumrahComponent } from './components/hajjandumrah/list-hajjandumrah/list-hajjandumrah.component';
import { EditHajjandumrahComponent } from './components/hajjandumrah/edit-hajjandumrah/edit-hajjandumrah.component';
import { ViewHajjandumrahComponent } from './components/hajjandumrah/view-hajjandumrah/view-hajjandumrah.component';

//supplication component
import { AddSupplicationComponent } from './components/supplication/add-supplication/add-supplication.component';
import { ListSupplicationComponent } from './components/supplication/list-supplication/list-supplication.component';
import { EditSupplicationComponent } from './components/supplication/edit-supplication/edit-supplication.component';
import { ViewSupplicationComponent } from './components/supplication/view-supplication/view-supplication.component';

//khutba component
import { AddKhutbaComponent } from './components/khutba/add-khutba/add-khutba.component';
import { ListKhutbaComponent } from './components/khutba/list-khutba/list-khutba.component';
import { EditKhutbaComponent } from './components/khutba/edit-khutba/edit-khutba.component';
import { ViewKhutbaComponent } from './components/khutba/view-khutba/view-khutba.component';

//donation component
import { AddDonationComponent } from './components/donation/add-donation/add-donation.component';
import { ListDonationComponent } from './components/donation/list-donation/list-donation.component';
import { EditDonationComponent } from './components/donation/edit-donation/edit-donation.component';
import { ViewDonationComponent } from './components/donation/view-donation/view-donation.component';

//supplication category component
import { AddDonationCategoryComponent } from './components/donation-category/add-donation-category/add-donation-category.component';
import { ListDonationCategoryComponent } from './components/donation-category/list-donation-category/list-donation-category.component';
import { EditDonationCategoryComponent } from './components/donation-category/edit-donation-category/edit-donation-category.component';
import { ViewDonationCategoryComponent } from './components/donation-category/view-donation-category/view-donation-category.component';

//quiz category model
import { AddQuizCategoryComponent } from './components/quiz-category/add-quiz-category/add-quiz-category.component';
import { ListQuizCategoryComponent } from './components/quiz-category/list-quiz-category/list-quiz-category.component';
import { EditQuizCategoryComponent } from './components/quiz-category/edit-quiz-category/edit-quiz-category.component';
import { ViewQuizCategoryComponent } from './components/quiz-category/view-quiz-category/view-quiz-category.component';

//quiz component
import { AddQuizComponent } from './components/quiz/add-quiz/add-quiz.component';
import { ListQuizComponent } from './components/quiz/list-quiz/list-quiz.component';
import { EditQuizComponent } from './components/quiz/edit-quiz/edit-quiz.component';
import { ViewQuizComponent } from './components/quiz/view-quiz/view-quiz.component';

//quiz rule component
import { AddQuizRuleComponent } from './components/quizrule/add-quizrule/add-quizrule.component';
import { ListQuizRuleComponent } from './components/quizrule/list-quizrule/list-quizrule.component';
import { EditQuizRuleComponent } from './components/quizrule/edit-quizrule/edit-quizrule.component';
import { ViewQuizRuleComponent } from './components/quizrule/view-quizrule/view-quizrule.component';

//payment component
import { AddPaymentComponent } from './components/payment/add-payment/add-payment.component';
import { ListPaymentComponent } from './components/payment/list-payment/list-payment.component';
import { EditPaymentComponent } from './components/payment/edit-payment/edit-payment.component';
import { ViewPaymentComponent } from './components/payment/view-payment/view-payment.component';

//Notification model
import { AddNotificationComponent } from './components/notification/add-notification/add-notification.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { EditNotificationComponent } from './components/notification/edit-notification/edit-notification.component';
import { ViewNotificationComponent } from './components/notification/view-notification/view-notification.component';

//Message model
import { AddMessageComponent } from './components/message/add-message/add-message.component';
import { ListMessageComponent } from './components/message/list-message/list-message.component';
import { EditMessageComponent } from './components/message/edit-message/edit-message.component';
import { ViewMessageComponent } from './components/message/view-message/view-message.component';

//prayer name model
import { AddPrayerNameComponent } from './components/prayer-name/add-prayer-name/add-prayer-name.component';
import { ListPrayerNameComponent } from './components/prayer-name/list-prayer-name/list-prayer-name.component';
import { EditPrayerNameComponent } from './components/prayer-name/edit-prayer-name/edit-prayer-name.component';
import { ViewPrayerNameComponent } from './components/prayer-name/view-prayer-name/view-prayer-name.component';

//Termcondition model
import { AddTermconditionComponent } from './components/termcondition/add-termcondition/add-termcondition.component';
import { ListTermconditionComponent } from './components/termcondition/list-termcondition/list-termcondition.component';
import { EditTermconditionComponent } from './components/termcondition/edit-termcondition/edit-termcondition.component';
import { ViewTermconditionComponent } from './components/termcondition/view-termcondition/view-termcondition.component';

const routes: Routes = [
  { path: 'listCalendar',component: ListCalendarComponent },
  { path: 'viewCalendar/:id', component: ViewCalendarComponent },
  { path: 'addCalendar', component: AddCalendarComponent },
  { path: 'editCalendar/:id', component: EditCalendarComponent },

  //Board route
  { path: 'listBoard', component: ListBoardComponent },
  { path: 'addBoard', component: AddBoardComponent },
  { path: 'editBoard/:id', component: EditBoardComponent },
  { path: 'viewBoard/:id', component: ViewBoardComponent },

  //Education route
  { path: 'listEducation', component: ListEducationComponent },
  { path: 'addEducation', component: AddEducationComponent },
  { path: 'editEducation/:id', component: EditEducationComponent },
  { path: 'viewEducation/:id', component: ViewEducationComponent },

  //Suggestion route
  { path: 'listSuggestion', component: ListSuggestionComponent },
  { path: 'addSuggestion', component: AddSuggestionComponent },
  { path: 'editSuggestion/:id', component: EditSuggestionComponent },
  { path: 'viewSuggestion/:id', component: ViewSuggestionComponent },

  //Activity route
  { path: 'listActivity', component: ListActivityComponent },
  { path: 'addActivity', component: AddActivityComponent },
  { path: 'editActivity/:id', component: EditActivityComponent },
  { path: 'viewActivity/:id', component: ViewActivityComponent },

  //News route
  { path: 'listNews', component: ListNewsComponent },
  { path: 'addNews', component: AddNewsComponent },
  { path: 'editNews/:id', component: EditNewsComponent },
  { path: 'viewNews/:id', component: ViewNewsComponent },

  //Association route
  { path: 'listAssociation', component: ListAssociationComponent },
  { path: 'addAssociation', component: AddAssociationComponent },
  { path: 'editAssociation/:id', component: EditAssociationComponent },
  { path: 'viewAssociation/:id', component: ViewAssociationComponent },

  //Prayer route
  { path: 'listPrayer', component: ListPrayerComponent },
  { path: 'addPrayer', component: AddPrayerComponent },
  { path: 'editPrayer/:id', component: EditPrayerComponent },
  { path: 'viewPrayer/:id', component: ViewPrayerComponent },

  //hajj and umrah route
  { path: 'listHajjandumrah', component: ListHajjandumrahComponent },
  { path: 'addHajjandumrah', component: AddHajjandumrahComponent },
  { path: 'editHajjandumrah/:id', component: EditHajjandumrahComponent },
  { path: 'viewHajjandumrah/:id', component: ViewHajjandumrahComponent },

  //supplication route
  { path: 'listSupplication', component: ListSupplicationComponent },
  { path: 'addSupplication', component: AddSupplicationComponent },
  { path: 'editSupplication/:id', component: EditSupplicationComponent },
  { path: 'viewSupplication/:id', component: ViewSupplicationComponent },

  //khutba route
  { path: 'listKhutba', component: ListKhutbaComponent },
  { path: 'addKhutba', component: AddKhutbaComponent },
  { path: 'editKhutba/:id', component: EditKhutbaComponent },
  { path: 'viewKhutba/:id', component: ViewKhutbaComponent },

  //donation route
  { path: 'listDonation', component: ListDonationComponent },
  { path: 'addDonation', component: AddDonationComponent },
  { path: 'editDonation/:id', component: EditDonationComponent },
  { path: 'viewDonation/:id', component: ViewDonationComponent },

  //donation category route
  { path: 'listDonationCategory', component: ListDonationCategoryComponent },
  { path: 'addDonationCategory', component: AddDonationCategoryComponent },
  { path: 'editDonationCategory/:id', component: EditDonationCategoryComponent },
  { path: 'viewDonationCategory/:id', component: ViewDonationCategoryComponent },

  //quiz category route
  { path: 'listQuizCategory', component: ListQuizCategoryComponent },
  { path: 'addQuizCategory', component: AddQuizCategoryComponent },
  { path: 'editQuizCategory/:id', component: EditQuizCategoryComponent },
  { path: 'viewQuizCategory/:id/:mosque_id', component: ViewQuizCategoryComponent },

  //quiz route
  { path: 'listQuiz', component: ListQuizComponent },
  { path: 'addQuiz', component: AddQuizComponent },
  { path: 'editQuiz/:id', component: EditQuizComponent },
  { path: 'viewQuiz/:id', component: ViewQuizComponent },

  //quiz rule route
  { path: 'listQuizRule', component: ListQuizRuleComponent },
  { path: 'addQuizRule', component: AddQuizRuleComponent },
  { path: 'editQuizRule/:id', component: EditQuizRuleComponent },
  { path: 'viewQuizRule/:id', component: ViewQuizRuleComponent },

  //payment route
  { path: 'listPayment', component: ListPaymentComponent },
  { path: 'addPayment', component: AddPaymentComponent },
  { path: 'editPayment/:id/:mosque_id', component: EditPaymentComponent },
  { path: 'viewPayment/:id/:mosque_id', component: ViewPaymentComponent },

  //Notification route
  { path: 'listNotification', component: ListNotificationComponent },
  { path: 'addNotification', component: AddNotificationComponent },
  { path: 'editNotification/:id/:mosque_id', component: EditNotificationComponent },
  { path: 'viewNotification/:id/:mosque_id', component: ViewNotificationComponent },

  //Message route
  { path: 'listMessage', component: ListMessageComponent },
  { path: 'addMessage', component: AddMessageComponent },
  { path: 'editMessage/:id/:mosque_id', component: EditMessageComponent },
  { path: 'viewMessage/:id/:mosque_id', component: ViewMessageComponent },

  //Prayer name route
  { path: 'listPrayerName', component: ListPrayerNameComponent },
  { path: 'addPrayerName', component: AddPrayerNameComponent },
  { path: 'editPrayerName/:id', component: EditPrayerNameComponent },
  { path: 'viewPrayerName/:id', component: ViewPrayerNameComponent },

    //Notification route
    { path: 'listTermcondition', component: ListTermconditionComponent },
    { path: 'addTermcondition', component: AddTermconditionComponent },
    { path: 'editTermcondition/:id', component: EditTermconditionComponent },
    { path: 'viewTermcondition/:id', component: ViewTermconditionComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class ManageMosqueRoutingModule { }
