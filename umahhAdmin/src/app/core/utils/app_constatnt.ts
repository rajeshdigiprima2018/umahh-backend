/*
Other Person: N/A
Coded Start Date: 25-10-2018
Coded End Date: cont.
Description: Following is used to all constants of API(url)
*/

import { environment } from './../../../environments/environment';
export class AppConst {

    private static appurl = environment.apiUrl;

    //user api
    public static get VERIFY(): string { return this.appurl + '/user/verifyAccount'};
    public static get USERREG(): string { return this.appurl + '/user/userRegister'};
    public static get FORGOTPASSWORD(): string { return this.appurl + '/user/password/forgot'};
    //public static get LOGINUSER():string {return this.appurl + '/user/userLogin'};
    public static get LOGINUSER():string {return this.appurl + '/user/login'};
    public static get GETALLUSERLIST():string {return this.appurl + '/user/getAllUser'};
    public static get GETALLUSERWEBLASTSEVENDAY():string {return this.appurl + '/web/user/getAllUserWeblastSevenDay'};
    public static get LOGOUT():string{return this.appurl + '/user/logout'};
    public static get UPDATEMOSQUEANDBUSINESSSTATUS(): string { return this.appurl + '/user/active'};
    public static get RESETPASSWORD(): string { return this.appurl + '/user/resetPassword'};
    public static get CHANGEPASSWORD(): string { return this.appurl + '/user/password/reset'};
    public static get GETUSERDETAIL(): string { return this.appurl + '/user/getUserDetail/'};
    public static get EDITPROFILE(): string { return this.appurl + '/user/modify'};

    public static get USERADDPHOTO(): string { return this.appurl + '/user/add/photo'};

    // List users
    public static get GETBUSINESSLIST(): string { return this.appurl + '/web/user/getAllUserWeb'};
    public static get GETMOSQUELIST(): string { return this.appurl + '/web/user/getAllUserWeb'};
    public static get GETUSERLIST(): string { return this.appurl + '/web/user/getAllUserWeb'};

    //counrty and satate and city list
    public static get GETCOUNTRY(): string { return this.appurl + '/user/getCountries'};
    public static get GETSTATE(): string { return this.appurl + '/user/getStates/'};
    public static get GETCITY(): string { return this.appurl + '/user/getCities/'};

    //manage mosque
    public static get ADDCONTENT(): string { return this.appurl + '/manageContent/addContent/'};

    //board data
    public static get GETBOARDLIST(): string { return this.appurl + '/web/Board/getAll/'};
    public static get ADDBOARD(): string { return this.appurl + '/mosque/Board/add'};
    public static get DELETEBOARDLISTID(): string { return this.appurl + '/mosque/Board/delete/'};
    public static get GETBOARDBYID(): string { return this.appurl + '/mosque/Board/get/'};
    public static get EDITBOARDBYID(): string { return this.appurl + '/mosque/Board/modify/'};
    public static get BOARDUPDATEPHOTO(): string { return this.appurl + '/mosque/Board/updatePhoto/'};

    //ADD CALENDAR
    public static get GETCALENDARLIST(): string { return this.appurl + '/web/Calendar/getAll/'};
    public static get ADDCALENDAR(): string { return this.appurl + '/mosque/Calendar/add'};
    public static get DELETECALENDARLISTID(): string { return this.appurl + '/mosque/Calendar/delete/'};
    public static get GETCALENDAR(): string { return this.appurl + '/mosque/Calendar/get/'};
    public static get EDITCALENDAR(): string { return this.appurl + '/mosque/Calendar/modify/'};

    //EDUCATION
    public static get GETEDUCATIONLIST(): string { return this.appurl + '/web/education/getAll/'};
    public static get ADDEDUCATION(): string { return this.appurl + '/mosque/education/add'};
    public static get DELETEEDUCATIONLISTID(): string { return this.appurl + '/mosque/education/delete/'};
    public static get GETEDUCATIONBYID(): string { return this.appurl + '/mosque/education/get/'};
    public static get EDITEDUCATION(): string { return this.appurl + '/mosque/education/modify/'};


    //SUGGESTION
    public static get GETSUGGESTIONLIST(): string { return this.appurl + '/web/Suggestions/getAll/'};
    public static get DELETESUGGESTIONLISTID(): string { return this.appurl + '/mosque/Suggestions/delete/'};

    //ACTIVITY
    public static get GETACTIVITYLIST(): string { return this.appurl + '/web/Activities/getAll/'};
    public static get ADDACTIVITY(): string { return this.appurl + '/mosque/Activities/add'};
    public static get DELETEACTIVITYLISTID(): string { return this.appurl + '/mosque/Activities/delete/'};
    public static get GETACTIVITYBYID(): string { return this.appurl + '/mosque/Activities/get/'};
    public static get EDITACTIVITYBYID(): string { return this.appurl + '/mosque/Activities/modify/'};
    public static get ACTIVITYUPDATEPHOTO(): string { return this.appurl + '/mosque/Activities/updatePhoto/'};

    //NEWS
    public static get GETNEWSLIST(): string { return this.appurl + '/web/News/getAll/'};
    public static get ADDNEWS(): string { return this.appurl + '/mosque/News/add'};
    public static get DELETENEWSLISTID(): string { return this.appurl + '/mosque/News/delete/'};
    public static get GETNEWSBYID(): string { return this.appurl + '/mosque/News/get/'};
    public static get NEWSUPDATEPHOTO(): string { return this.appurl + '/mosque/News/updatePhoto/'};
    public static get EDITNEWSBYID(): string { return this.appurl + '/mosque/News/modify/'};


    //prayer
    public static get GETPYAYERNAMELIST(): string { return this.appurl + '/web/prayername/getAll'};

    public static get GETPYAYERLIST(): string { return this.appurl + '/web/prayer/getAll/'};
    public static get GETPYAYERLISTID(): string { return this.appurl + '/mosque/prayer/get/'};
    public static get ADDPYAYER(): string { return this.appurl + '/mosque/prayer/add'};
    public static get DELETEPYAYERLISTID(): string { return this.appurl + '/mosque/prayer/delete/'};
    public static get EDITPYAYERBYID(): string { return this.appurl + '/mosque/prayer/modify/'};

    //ASSOCIATION
    public static get GETASSOCIATIONLIST(): string { return this.appurl + '/web/Associates/getAll/'};
    public static get DELETEASSOCIATIONID(): string { return this.appurl + '/mosque/Associates/delete'};
    public static get ADDASSOCIATES(): string { return this.appurl + '/mosque/Associates/add'};
    public static get GETSEARCHMOSQUE(): string { return this.appurl + '/mosque/searchMosque'};

    //supplication
    public static get GETSUPPCATEGORYLIST(): string { return this.appurl + '/supplication/getAllCategory'};
    public static get ADDSUPPLICATION(): string { return this.appurl + '/supplication/add'};
    public static get GETSUPPLICATIONLIST(): string { return this.appurl + '/web/supplication/getAll'};
    public static get DELETESUPPLICATION(): string { return this.appurl + '/supplication/delete/'};
    public static get GETSUPPLICATIONBYID(): string { return this.appurl + '/supplication/get/'};
    public static get EDITSUPLICATIONBYID(): string { return this.appurl + '/supplication/modify/'};


    //UMRAHCATEGORYLIST
    public static get GETUMRAHCATEGORYLIST(): string { return this.appurl + '/hajjumrah/getAllCategoryUmrah'};
    public static get GETHAJJUMRAHLIST(): string { return this.appurl + '/web/hajjumrah/getAll'};
    public static get ADDHAJJANDUMRAH(): string { return this.appurl + '/hajjumrah/add'};
    public static get GETHAJJANDUMRAHBYID(): string { return this.appurl + '/hajjumrah/get/'};
    public static get EDITHAJJANDUMRAHBYID(): string { return this.appurl + '/hajjumrah/modifyHajjAndUmrah/'};
    public static get DELETEHAJJANDUMRAH(): string { return this.appurl + '/hajjumrah/delete/'};

    //KHUTBA
    public static get GETKHUTBALIST(): string { return this.appurl + '/web/khutba/getAll/'};
    public static get GETKHUTBABYID(): string { return this.appurl + '/mosque/khutba/get/'};
    public static get ADDKHUTBA(): string { return this.appurl + '/mosque/khutba/add'};
    public static get DELETEKHUTBA(): string { return this.appurl + '/mosque/khutba/delete/'};
    public static get EDITKHUTBA(): string { return this.appurl + '/mosque/khutba/modify/'};

    //DONATION
    public static get GETDONATIONLIST(): string { return this.appurl + '/donation/setAmount/getAll/'};
    public static get GETDONATIONCATEGORYLIST(): string { return this.appurl + '/web/donation/category/getAll'};
    public static get GETDONATIONBYID(): string { return this.appurl + '/donation/amount/get/'};
    public static get EDITDONATIONBYID(): string { return this.appurl + '/donation/modifyDonationAmount/'};
    public static get ADDDONATION(): string { return this.appurl + '/donation/setAmount/add'};
    public static get DELETEDONATION(): string { return this.appurl + '/donation/setAmount/delete/'};
    public static get ADDDONATIONCATEGORY(): string { return this.appurl + '/donation/category/add'};
    public static get GETCATEGORYBYID(): string { return this.appurl + '/donation/category/get/'};
    public static get EDITDONATIONCATEGORY(): string { return this.appurl + '/donation/category/update/'};
    public static get UPDATEDONATIONCATEGORYSTATUS(): string { return this.appurl + '/donation/category/statusupdate/'};

    public static get DELETEDONATIONCATEGORY(): string { return this.appurl + '/donation/category/delete/'};

    //QUIZ
    public static get ADDQUIZ(): string { return this.appurl + '/quiz/add'};
    public static get GETQUIZLIST(): string { return this.appurl + '/web/quiz/getAll'};
    public static get GETQUIZBYID(): string { return this.appurl + '/quiz/get/'};
    public static get EDITQUIZBYID(): string { return this.appurl + '/quiz/modify/'};
    public static get DELETEQUIZBYID(): string { return this.appurl + '/quiz/delete/'};

    public static get ADDQUIZCATEGORY(): string { return this.appurl + '/quiz/Category/add'};
    public static get GETQUIZCATEGORYLIST(): string { return this.appurl + '/quiz/Category/getAll'};
    public static get DELETEQUIZDONATION(): string { return this.appurl + '/quiz/Category/delete/'};
    public static get GETQUIZCATEGORYBYID(): string { return this.appurl + '/quiz/Category/get/'};
    public static get EDITQUIZCATEGORYBYID(): string { return this.appurl + '/quiz/Category/modify/'};

    //QUIZ RULE
    public static get ADDQUIZRULE(): string { return this.appurl + '/quiz/rule/add'};
    public static get GETQUIZRULELIST(): string { return this.appurl + '/web/quiz/rule/getAll'};
    public static get GETQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/get/'};
    public static get EDITQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/modify/'};
    public static get DELETEQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/delete/'};


    //GET PAYMENT USER
    public static get GETPAYMENTLIST(): string { return this.appurl + '/payment/getPaymentByMosque'};

    // ADDNOTIFICATION
    public static get ADDNOTIFICATION(): string { return this.appurl + '/notification/add'};
    public static get GETNOTIFICATIONLIST(): string { return this.appurl + '/web/notification/getAll/'};
    /*public static get GETQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/get/'};
    public static get EDITQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/modify/'};*/
    public static get DELETENOTIFICATIONBYID(): string { return this.appurl + '/notification/delete/'};

    // TERMCONDITION
    public static get ADDTERMCONDITION(): string { return this.appurl + '/termcondition/add'};
    public static get GETTERMCONDITIONLIST(): string { return this.appurl + '/web/termcondition/getAll'};
    /*public static get GETQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/get/'};
    public static get EDITQUIZRULEBYID(): string { return this.appurl + '/quiz/rule/modify/'};*/
    //public static get DELETENOTIFICATIONBYID(): string { return this.appurl + '/notification/delete/'};

    //message send
    public static get GETMESSAGEALLUSERLIST(): string { return this.appurl + '/message/getAllUser'};
    public static get ADDMESSAGE(): string { return this.appurl + '/message/add'};
    public static get GETMESSAGELIST(): string { return this.appurl + '/message/getAll/'};

    //prayer add name
    public static get ADDPRAYERNAME(): string { return this.appurl + '/web/prayername/add'};
    public static get GETPRAYERNAMELISTID(): string { return this.appurl + '/web/prayername/getAll'};
    public static get GETPYAYERNAMEBYID(): string { return this.appurl + '/web/prayername/get/'};
    public static get EDITPYAYERNAMEBYID(): string { return this.appurl + '/web/prayername/modify/'};
    public static get DELETEPYAYERBYID(): string { return this.appurl + '/web/prayername/delete/'};



    public static get LISTCONTENT(): string { return this.appurl + '/manageContent/listContent/'};
    public static get LISTHEALTHCONTENT(): string { return this.appurl + '/manageContent/listHealthContent/'};
    public static get GETTOPICBYID(): string { return this.appurl + '/manageContent/getTopicById/'};
    public static get EDITTOPIC(): string { return this.appurl + '/manageContent/editContent/'};
    public static get CLINICLISTTOASSIGNCONTENT(): string { return this.appurl + '/manageContent/clinicListToAssignContent/'};
    public static get CREATEASSIGNCONTENT(): string { return this.appurl + '/manageContent/createAssignContent/'};
    public static get LISTASSIGNCONTENTTOCLINIC(): string { return this.appurl + '/manageContent/listAssignContentToClinic'};

    public static get CONTACTUS(): string { return this.appurl + '/user/contactUs'; };
    public static get UPDATECLINICSTATUS(): string { return this.appurl + '/user/active'};
    public static get ADDUSERNEW(): string { return this.appurl + '/user/register'; };
    public static get ADDUSER(): string { return this.appurl + '/user/userRegister'; };
    public static get UPDATEUSER(): string { return this.appurl + '/user/updateUser/'; };
    public static get USERLISTING(): string { return this.appurl + '/user/userListing/'; };
    public static get DELETEUSER(): string { return this.appurl + '/web/user/deleteUser/'; };

    public static get GETSEARCHUSERLISTING(): string { return this.appurl + '/user/getSearchUserListing/'; };
    public static get GETGENERALCLINICLISTING(): string { return this.appurl + '/user/getGeneralClinicListing/'; };
    ;
    public static get GETLISTOFUSERANDSTAFF (): string { return this.appurl + '/user/getListOfUserAndStaff'; };


    public static get ADDCLINICBYADMIN(): string { return this.appurl + '/user/addClinic/'; };
    public static get ADDSUPPORTADMIN(): string { return this.appurl + '/user/addSupportAdmin'; };
    public static get GETSUPPORTADMINLIST(): string { return this.appurl + '/user/getSupportAdminList/'; };
    public static get getClinicStaffList(): string { return this.appurl + '/user/getClinicStaffList/'; };


    //Role api
    public static get GETROLELIST(): string { return this.appurl + '/roles/listRole/'};
    public static get DELETEROLE(): string { return this.appurl + '/roles/deleteRole/'};
    public static get SAVEROLE(): string { return this.appurl + '/roles/addOrUpdateRole'};
    public static get UPDATEROLE(): string { return this.appurl + '/roles/updateRole'};
    public static get GETROLEBYID(): string { return this.appurl + '/roles/getRoleById/'};

    //Assign Category list
    public static get POSTASSIGNCATEORY(): string { return this.appurl + '/assignCategory/addAssignCategory'};
    public static get GETASSIGNCATEORYLIST(): string { return this.appurl + '/assignCategory/listAssignCategory'};
    public static get GETCATEORYBYID(): string { return this.appurl + '/assignCategory/getCategoryById/'};
    public static get DELETECATEGORY(): string { return this.appurl + '/assignCategory/deleteAssignCategory'};
    public static get UPDATECATEGORY(): string { return this.appurl + '/assignCategory/updateAssignCategory'};
    public static get TRANSFERPAYMENTTOMOSQUE(): string { return this.appurl + '/web/transferpaymenttomosque/add'};

   //Clinic Category list
    public static get POSTCLINICCATEORY(): string { return this.appurl + '/clinicCategory/addClinicCategory'};
    public static get GETCLINICCATEORYLIST(): string { return this.appurl + '/clinicCategory/listClinicCategory'};
    public static get GETCLINICCATEORYBYID(): string { return this.appurl + '/clinicCategory/getCategoryById/'};
    public static get DELETECLINICCATEGORY(): string { return this.appurl + '/clinicCategory/deleteClinicCategory'};
    public static get UPDATECLINICCATEGORY(): string { return this.appurl + '/clinicCategory/updateClinicCategory'};

    //survey questionary
    public static get createSurveyQuestionary(): string { return this.appurl + '/surveyQuestionary/createSurvey'};
    public static get getSurveyQuestionary(): string { return this.appurl + '/surveyQuestionary/getSurvey'};
    public static get getPatientAssignSurveyList(): string { return this.appurl + '/surveyQuestionary/getPatientAssignSurveyList'};
    public static get getSurveyRecordById(): string { return this.appurl + '/surveyQuestionary/getSurveyRecordById'};
    public static get updateSurveyRecord(): string { return this.appurl + '/surveyQuestionary/updateSurveyRecord'};
    public static get removeSurveyQuestionary(): string { return this.appurl + '/surveyQuestionary/removeSurvey/'};
    public static get fillQuestionnaire(): string { return this.appurl + '/user/getUserDetail/'};
    public static get getSurveyTemplateList(): string { return this.appurl + '/surveyQuestionary/getSurveyTemplateList'};
    public static get GETCREATEDBYDETAILS(): string { return this.appurl + '/surveyQuestionary/getCreatedByDetails'};
    static get GETALLTEMPLETELIST(): string { return this.appurl + '/surveyQuestionary/getAllTempleteList'};

    // get content category list
    public static get categoryList(): string { return this.appurl + '/contentCategory/listContentCategory'};


    //Add Ads
    public static get ADDADS(): string { return this.appurl + '/manageContent/addAd/'};
    public static get ADDMULTIPLEADS(): string { return this.appurl + '/manageContent/addMultipleAd/'};
    public static get LISTADS(): string { return this.appurl + '/manageContent/listAd/'};
    public static get DELETEADS(): string { return this.appurl + '/manageContent/deleteAd/'};


    //Add to history
    public static get ADDTOHISTORY(): string { return this.appurl + '/manageContent/addtohistory/'};
    public static get LISTHISTORY(): string { return this.appurl + '/manageContent/listhistory/'};
    public static get MOSTVIEWEDCONTENTLIST(): string { return this.appurl + '/manageContent/mostViewedContentList/'};

    //without middleware for public users who not get registered with Mdout
    public static get LISTGENERALCONTENT(): string { return this.appurl + '/manageContent/listGeneralContent/'};
    public static get GETCONTENTBYID(): string { return this.appurl + '/manageContent/getContentById/'};
    public static get LISTCONTENTLIKECOMMENTSHARE(): string { return this.appurl + '/manageContent/listContentLikeCommentShare/'};

    public static get ADDCONTENTLIKECOMMENTSHARE(): string { return this.appurl + '/manageContent/addContentLikeCommentShare/'};
    //email template
    public static get LISTEMAILTEMPLATE(): string { return this.appurl + '/emailTemplate/listEmailTemplate/'};
    public static get GETEMAILTEMPLATEBYID(): string { return this.appurl + '/emailTemplate/getEmailTemplateById/'};
    public static get EDITEMAILTEMPLATE(): string { return this.appurl + '/emailTemplate/editEmailTemplate/'};

    //assign survey
    public static get ASSIGNSUREVEY(): string { return this.appurl + '/assignQuestionary/createAssignSurvey'};
    public static get GETASSIGNEDSURVEYS(): string { return this.appurl + '/assignQuestionary/getAssignedSurveys'};
    public static get ASSIGNSURVEYTOSTAFF(): string { return this.appurl + '/assignQuestionary/assignSurveyToStaff'};
    public static get GETASSIGNSURVEYBYID(): string { return this.appurl + '/assignQuestionary/getAssignSurveyById'};
    public static get ADDNOTES(): string { return this.appurl + '/assignQuestionary/addNotes'};
    public static get LISTNOTES(): string { return this.appurl + '/assignQuestionary/getNotes'};
    public static get DELETENOTE(): string { return this.appurl + '/assignQuestionary/deleteNote'};
    public static get GETNOTEBYID(): string { return this.appurl + '/assignQuestionary/getNoteById'};
    public static get EDITNOTE(): string { return this.appurl + '/assignQuestionary/editNote'};



    //assign Provider
    public static get ASSIGNPROVIDER(): string { return this.appurl + '/assignProvider/addAssignProvider'};


    //save filled survey
    public static get SAVESURVEYFILLED(): string { return this.appurl + '/assignQuestionary/saveSurveyFilled'};

    //dashboard
    public static get CLINICDASHBOARDLISTING(): string { return this.appurl + '/dashboard/listClinicDashboard' };
    public static get USERDASHBOARDLISTING(): string { return this.appurl + '/dashboard/listUserDashboard' };
    public static get ADMINDASHBOARDLISTING(): string { return this.appurl + '/dashboard/listAdminDashboard' };
    public static get getRecomdedContent(): string { return this.appurl + '/getRecomdedContent/'; };

    //publish contents to make it public (visible on HomePage)
    public static get PUBLISHCONTENT(): string { return this.appurl + '/manageContent/publishContent'};

    //fillQuestionary
    public static get LISTFILLQUESTION(): string { return this.appurl + '/fillQuestionary/listFillQuestion'};

    //twilio
    public static get GETTWILIOTOKEN(): string { return this.appurl + '/group/getToken' };
    public static get CREATEGROUP(): string { return this.appurl + '/group/createGroup' };
    public static get GROUPLIST(): string { return this.appurl + '/group/groupList' };
    public static get ALLMSGINCHANNEL (): string { return this.appurl + '/group/allMsgInChannel'};
    public static get SENDMSGTOCHANNEL (): string { return this.appurl + '/group/sendMsgToChannel'};
    public static get CREATEUSERFORTWILIO (): string { return this.appurl + '/group/createUserForTwilio'};

    //patient
    public static get ADDPATIENT(): string { return this.appurl + '/patient/userRegister'};
    public static get UPDATEPATIENT(): string { return this.appurl + '/patient/updateUser/' };
    public static get PATIENTLISTING(): string { return this.appurl + '/patient/userListing/' };
    public static get DELETEPATIENT(): string { return this.appurl + '/patient/deleteUser'};
    public static get GETPATIENTDETAIL(): string { return this.appurl + '/patient/getUserDetail/'};
    public static get GETSEARCHPATIENTLISTING(): string { return this.appurl + '/patient/getSearchUserListing/'};

    //createBinding
    public static get   CREATEBINDING(): string { return this.appurl + '/group/createBinding/'};

};