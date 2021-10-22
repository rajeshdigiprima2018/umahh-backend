import { Injectable } from '@angular/core';
import { httpClient } from '../../../core/http.client';
import { Observable } from 'rxjs';
import { AppConst } from '../../../core/utils/app_constatnt';

@Injectable({
  providedIn: 'root'
})
export class ManageMosqueService {
  constructor(private http: httpClient) { }

  addContent(data): Observable<any> {
    return this.http.post(AppConst.ADDCONTENT, data)
  }
  //add Board service
  getBoardList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETBOARDLIST + id, data);
  }
  getBoardById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETBOARDBYID + _id, {});
  }
  addBoard(data: any): Observable<any> {
    return this.http.post(AppConst.ADDBOARD, data);
  }
  editBoardById(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.EDITBOARDBYID + _id, data);
  }
  deleteBoard(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEBOARDLISTID + id);
  }
  boardUpdatePhoto(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.BOARDUPDATEPHOTO + _id, data);
  }

  //add Calendar service
  getCalendarList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETCALENDARLIST + id, data);
  }
  addCalendar(data: any): Observable<any> {
    return this.http.post(AppConst.ADDCALENDAR, data);
  }
  deleteCalendar(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETECALENDARLISTID + id);
  }
  getCalendarById(id: any): Observable<any> {
    return this.http.get(AppConst.GETCALENDAR + id,{});
  }

  editCalendar(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.EDITCALENDAR + _id, data);
  }

  //Education
  getEducationList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETEDUCATIONLIST + id, data);
  }
  addEducation(data: any): Observable<any> {
    return this.http.post(AppConst.ADDEDUCATION, data);
  }
  deleteEducation(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEEDUCATIONLISTID + id);
  }
  getEducationById(id: any): Observable<any> {
    return this.http.get(AppConst.GETEDUCATIONBYID + id,{});
  }
  editEducation(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.EDITEDUCATION + _id, data);
  }

  //Suggestion
  getSuggestionList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETSUGGESTIONLIST + id, data);
  }
  deleteSuggestion(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETESUGGESTIONLISTID + id);
  }

  //Activity
  getActivityList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETACTIVITYLIST + id, data);
  }
  addActivity(data: any): Observable<any> {
    return this.http.post(AppConst.ADDACTIVITY, data);
  }
  getActivityById(id: any): Observable<any> {
    return this.http.get(AppConst.GETACTIVITYBYID + id,{});
  }
  deleteActivity(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEACTIVITYLISTID + id);
  }
  editActivityById(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.EDITACTIVITYBYID + _id, data);
  }
  activityUpdatePhoto(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.ACTIVITYUPDATEPHOTO + _id, data);
  }

  //NEWS
  getNewsList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETNEWSLIST + id, data);
  }
  addNews(data: any): Observable<any> {
    return this.http.post(AppConst.ADDNEWS, data);
  }
  getNewsById(id: any): Observable<any> {
    return this.http.get(AppConst.GETNEWSBYID + id,{});
  }
  deleteNews(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETENEWSLISTID + id);
  }
  newsUpdatePhoto(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.NEWSUPDATEPHOTO + _id, data);
  }
  editNewsById(_id:any,data: any): Observable<any> {
    return this.http.post(AppConst.EDITNEWSBYID + _id, data);
  }

  //prayer data
  getPrayeNamelist({}): Observable<any> {
    return this.http.post(AppConst.GETPYAYERNAMELIST, {});
  }
  getPrayerList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETPYAYERLIST + id, data);
  }
  addPrayer(data: any): Observable<any> {
    return this.http.post(AppConst.ADDPYAYER, data);
  }
  getPrayerListId(id: any): Observable<any> {
    return this.http.get(AppConst.GETPYAYERLISTID + id, {});
  }
  deletePrayer(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEPYAYERLISTID + id);
  }
  editPrayerById(_id: any,data:any): Observable<any> {
    return this.http.post(AppConst.EDITPYAYERBYID + _id, data);
  }

  //getAssociationList
  getAssociationList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETASSOCIATIONLIST + id, data);
  }
  deleteAssociation(data: any): Observable<any> {
    return this.http.post(AppConst.DELETEASSOCIATIONID, data);
  }
  getMosqueListing(data: any): Observable<any> {
    return this.http.post(AppConst.GETMOSQUELIST,data);
  }
  addAssociates(data: any): Observable<any> {
    return this.http.post(AppConst.ADDASSOCIATES, data);
  }
  getSearchMosque(data: any): Observable<any> {
    return this.http.post(AppConst.GETSEARCHMOSQUE, data);
  }

  //umrah and hajj category
  getAllCategoryUmrahList(id: any): Observable<any> {
    return this.http.get(AppConst.GETUMRAHCATEGORYLIST, {});
  }
  getHajjAndUmrahList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETHAJJUMRAHLIST, data);
  }
  addHajjAndUmrah(data: any): Observable<any> {
    return this.http.post(AppConst.ADDHAJJANDUMRAH, data);
  }
  getHajjAndUmrahById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETHAJJANDUMRAHBYID + _id, {});
  }
  editHajjAndUmrahById(_id: any,data:any): Observable<any> {
    return this.http.post(AppConst.EDITHAJJANDUMRAHBYID + _id, data);
  }
  deleteHajjAndUmrah(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEHAJJANDUMRAH + id);
  }

  //SUPPLICATION
  getSupplicationCategoryList(id: any): Observable<any> {
    return this.http.get(AppConst.GETSUPPCATEGORYLIST, {});
  }
  getSupplicationList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETSUPPLICATIONLIST, data);
  }
  addSupplication(data: any): Observable<any> {
    return this.http.post(AppConst.ADDSUPPLICATION, data);
  }
  deleteSupplication(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETESUPPLICATION + id);
  }
  getSupplicationById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETSUPPLICATIONBYID + _id, {});
  }
  editSupplicationById(_id: any,data:any): Observable<any> {
    return this.http.post(AppConst.EDITSUPLICATIONBYID + _id, data);
  }


  //Khutba
  getKhutbaList(id: any, data:any): Observable<any> {
    return this.http.post(AppConst.GETKHUTBALIST + id, data);
  }

  getKhutbaById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETKHUTBABYID + _id, {});
  }
  addKhutba(data: any): Observable<any> {
    return this.http.post(AppConst.ADDKHUTBA, data);
  }
  deleteKhutba(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEKHUTBA + id);
  }

  editKhutba(_id: any,data:any): Observable<any> {
    return this.http.post(AppConst.EDITKHUTBA + _id, data);
  }

  //Donation
  getDonationList(id: any): Observable<any> {
    return this.http.get(AppConst.GETDONATIONLIST + id, {});
  }
  getAllDonationCategory(data: any): Observable<any> {
    return this.http.post(AppConst.GETDONATIONCATEGORYLIST, data);
  }
  addDonation(data: any): Observable<any> {
    return this.http.post(AppConst.ADDDONATION, data);
  }
  deleteDonation(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEDONATION + id);
  }
  getDonationById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETDONATIONBYID + _id, {});
  }
  editDonationById(_id: any, data: any): Observable<any> {
    return this.http.post(AppConst.EDITDONATIONBYID + _id, data);
  }

  addDonationCategory(data: any): Observable<any> {
    return this.http.post(AppConst.ADDDONATIONCATEGORY, data);
  }
  getCategoryById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETCATEGORYBYID + _id, {});
  }
  updateDonationCategoryStatus(_id: any, data: any): Observable<any> {
    return this.http.post(AppConst.UPDATEDONATIONCATEGORYSTATUS + _id, data);
  }
  editDonationCategory(_id:any, data: any): Observable<any> {
    return this.http.post(AppConst.EDITDONATIONCATEGORY + _id, data);
  }

  deleteDonationategory(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEDONATIONCATEGORY + id);
  }

  //get all quiz
/*  getDonationList(id: any): Observable<any> {
    return this.http.get(AppConst.GETDONATIONLIST + id, {});
  }
  getAllDonationCategory(id: any): Observable<any> {
    return this.http.get(AppConst.GETDONATIONCATEGORYLIST + id, {});
  }*/
  addQuiz(data: any): Observable<any> {
    return this.http.post(AppConst.ADDQUIZ, data);
  }

  getQuizList(data:any): Observable<any> {
    return this.http.post(AppConst.GETQUIZLIST, data);
  }
  getQuizById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETQUIZBYID + _id, {});
  }
  deleteQuiz(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEQUIZBYID + id);
  }
  editQuizById(_id: any, data: any): Observable<any> {
    return this.http.post(AppConst.EDITQUIZBYID + _id, data);
  }

  addQuizCategory(data: any): Observable<any> {
    return this.http.post(AppConst.ADDQUIZCATEGORY, data);
  }
  getAllQuizCategory(): Observable<any> {
    return this.http.get(AppConst.GETQUIZCATEGORYLIST, {});
  }
  deleteQuizCategory(quiz_category_id: any): Observable<any> {
    return this.http.delete(AppConst.DELETEQUIZDONATION + quiz_category_id);
  }
  getQuizCategoryById(quiz_category_id: any): Observable<any> {
    return this.http.get(AppConst.GETQUIZCATEGORYBYID + quiz_category_id, {});
  }
  editQuizCategory(quiz_category_id: any, data: any): Observable<any> {
    return this.http.post(AppConst.EDITQUIZCATEGORYBYID + quiz_category_id, data);
  }

  //quiz rule
   addQuizRule(data: any): Observable<any> {
      return this.http.post(AppConst.ADDQUIZRULE, data);
    }

    getquizRuleList(data:any): Observable<any> {
      return this.http.post(AppConst.GETQUIZRULELIST, data);
    }
    getQuizRuleById(_id: any): Observable<any> {
      return this.http.get(AppConst.GETQUIZRULEBYID + _id, {});
    }
    deleteQuizruleById(id: any): Observable<any> {
      return this.http.delete(AppConst.DELETEQUIZRULEBYID + id);
    }
    editQuizRuleById(_id: any, data: any): Observable<any> {
      return this.http.post(AppConst.EDITQUIZRULEBYID + _id, data);
    }


  //payment user get
  getPaymentList(data:any): Observable<any> {
    return this.http.post(AppConst.GETPAYMENTLIST, data);
  }
  transferpaymenttomosque(data:any): Observable<any> {
    return this.http.post(AppConst.TRANSFERPAYMENTTOMOSQUE, data);
  }
// Notification
  addNotification(data: any): Observable<any> {
    return this.http.post(AppConst.ADDNOTIFICATION, data);
  }

  getNotificationList(_id:any, data:any): Observable<any> {
    return this.http.post(AppConst.GETNOTIFICATIONLIST + _id, data);
  }
 /* getQuizRuleById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETQUIZRULEBYID + _id, {});
  }*/
  deleteNotificationById(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETENOTIFICATIONBYID + id);
  }
 /* editQuizRuleById(_id: any, data: any): Observable<any> {
    return this.http.post(AppConst.EDITQUIZRULEBYID + _id, data);
  }*/

  // Notification
  addTermcondition(data: any): Observable<any> {
    return this.http.post(AppConst.ADDTERMCONDITION, data);
  }

  getTermconditionList( data:any): Observable<any> {
    return this.http.post(AppConst.GETTERMCONDITIONLIST, data);
  }
 /* getQuizRuleById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETQUIZRULEBYID + _id, {});
  }*/
 /*  deleteNotificationById(id: any): Observable<any> {
    return this.http.delete(AppConst.DELETENOTIFICATIONBYID + id);
  }
 */
  //message send data
  getMessageAllUserList(_id:any): Observable<any> {
    return this.http.get(AppConst.GETMESSAGEALLUSERLIST,{});
  }
  addMessage(data: any): Observable<any> {
    return this.http.post(AppConst.ADDMESSAGE, data);
  }
  getMessageList(reciveUserId: any): Observable<any> {
    return this.http.get(AppConst.GETMESSAGELIST + reciveUserId, {});
  }

    //prayer data
  getPrayerNameById(_id: any): Observable<any> {
    return this.http.get(AppConst.GETPYAYERNAMEBYID + _id, {});
  }
  addPrayerName(data: any): Observable<any> {
    return this.http.post(AppConst.ADDPRAYERNAME, data);
  }
  getPrayerNameList(id: any, data:any): Observable<any> {
    return this.http.get(AppConst.GETPRAYERNAMELISTID, {});
  }
  deletePrayerNameById(_id: any): Observable<any> {
   return this.http.delete(AppConst.DELETEPYAYERBYID + _id);
  }
  editPrayerNameById(_id: any,data:any): Observable<any> {
    return this.http.post(AppConst.EDITPYAYERNAMEBYID + _id, data);
  }




  listContent(data): Observable<any> {
    return this.http.post(AppConst.LISTCONTENT, data)
  }

  listHealthContent(data): Observable<any> {
    return this.http.post(AppConst.LISTHEALTHCONTENT, data)
  }

  listAssignContentToClinic(data): Observable<any> {
    return this.http.post(AppConst.LISTASSIGNCONTENTTOCLINIC, data)
  }

  getContentListId(id: any): Observable<any> {
    return this.http.get(AppConst.GETTOPICBYID + id, {});
  }

  editContent(data): Observable<any> {
    return this.http.post(AppConst.EDITTOPIC, data);
  }
  clinicListToAssignContent(data): Observable<any> {
    return this.http.post(AppConst.CLINICLISTTOASSIGNCONTENT, data);
  }
  createAssignContent(data): Observable<any> {
    return this.http.post(AppConst.CREATEASSIGNCONTENT, data);
  }
  addContentLikeCommentShare(data): Observable<any> {
    return this.http.post(AppConst.ADDCONTENTLIKECOMMENTSHARE, data);
  }

  listContentLikeCommentShare(data): Observable<any> {
    return this.http.post(AppConst.LISTCONTENTLIKECOMMENTSHARE, data);
  }
  getContentById(id: any): Observable<any> {
    return this.http.get(AppConst.GETCONTENTBYID + id, {});
  }

  //Add to history
  addtoHistory(data: any): Observable<any> {
    return this.http.post(AppConst.ADDTOHISTORY, data);
  }

  listHistory(data): Observable<any> {
    return this.http.post(AppConst.LISTHISTORY, data)
  }

  //for sorting the list contents
  getCreatedByDetails(data: any): Observable<any> {
    return this.http.post(AppConst.GETCREATEDBYDETAILS, data);
  }

  getSearchUserDetails(data: any):Observable<any> {
    return this.http.post(AppConst.GETSEARCHUSERLISTING,data);
  }

  //publish contents to make it public (visible on HomePage)
  publishContent(data): Observable<any> {
    return this.http.post(AppConst.PUBLISHCONTENT, data);
  }

  //for adding ads
  addAd(data):Observable<any> {
    return this.http.post(AppConst.ADDADS, data);
  }
  addMultipleAd(data):Observable<any> {
    return this.http.post(AppConst.ADDMULTIPLEADS, data);
  }

  listAd(id : any): Observable<any> {
    return this.http.get(AppConst.LISTADS + id,{});
  }

  deleteAds(id: any): Observable<any> {
    return this.http.get(AppConst.DELETEADS + id, {});
  }

  categoryList(data: any): Observable<any> {
    return this.http.get(AppConst.categoryList, data);
}


}
