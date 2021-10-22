import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { appConfig } from '../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ChatService } from './service/chat.service';
import { ToastrService } from 'ngx-toastr';
import { UserComponentService } from '../users/services/user-component.service';
import { environment } from '../../../environments/environment';
import * as underscore from 'underscore';
declare const Twilio: any;
// import * as firebase from 'firebase';
import { MessagingService } from '../../shared/messaging/messaging.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  loggedInUserDetails: any = '';
  messgaeForm: FormGroup;
  chatClient: any;
  generalChannel: any;
  userID: any;
  list: any;
  searchUserForm: FormGroup;
  addGroupForm: FormGroup;
  isLoading: boolean = false;
  userData: any;
  groupData: any;
  channelMsgData: any;
  imageurl: string = environment.backendBaseUrl;
  baseurl: string = environment.baseUrl;
  userDetails: any;
  count: number = appConfig.paginator.COUNT;
  page: number = appConfig.paginator.PAGE;
  totalCount: number = 0;
  pageCountLink: any;
  showAddParticipants: boolean = false;
  selectedAll: any;
  showDialogGrpName: boolean = false;
  activeCls: boolean = false;
  client: any;
  selectedChnSid: any;
  selectedServiceSid: any;
  groupName: any;
  imgUrl: any;
  attachForm: FormGroup;
  formData: boolean = false;
  fmessage: any;
  // firebase = firebase.messaging();
  constructor(private localSt: LocalStorageService,
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private toastr: ToastrService,
    private userService: UserComponentService,
    private msgService: MessagingService
  ) { }

  ngOnInit() {

    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.userID = this.loggedInUserDetails._id;
    this.userDetails = this.loggedInUserDetails;
    this.getToken();
    // console.log("here is user details:::>", this.userDetails)
    this.messgaeForm = this.formBuilder.group({
      message: ['', [Validators.required]],
      mediaUrl: new FormControl('')
    })
    this.searchUserForm = this.formBuilder.group({
      searchText: new FormControl(''),
    });
    this.addGroupForm = this.formBuilder.group({
      groupName: new FormControl('', [Validators.required]),
    });
    this.getListOfUserAndStaff();
    this.msgService.getPermission()
    this.msgService.receiveMessage()
    this.fmessage = this.msgService.currentMessage
  }
  //At initial we need token to start chat , this is get call for to get token.
  //parameter identity is required.
  getToken() {
    let obj = {
      identity: this.loggedInUserDetails._id
      //endpointId:Math.floor(Math.random() * 1000) + 1
    }
    console.log('obj', obj);
    this.chatService.getToken(obj).subscribe(res => {
      if (res && res.code == 200) {
        //On geting token, here we are creating instance of chat service.
        this.chatClient = new Twilio.Chat.Client(res.data.token);
        //intilize the chat instance
        this.chatClient.initialize().then(client => {
          console.log('client:::>', client);
          //ensure that your client is registering for receiving push notifications 
          //(as you have correctly mentioned, via setPushRegistrationId)
          client.setPushRegistrationId = this.localSt.retrieve('fcmtoken');
          this.client = client;
        })
      } else {
        this.toastr.error(res.message)
      }
    });
  }
  //@para name : name of channel, channelSid : sid field of response getting from created channel
  //serviceSid : sid field of chat service.
  //In this function geting channel by unique name which is id of mongo db.

  setupChannel(name, channelSid, serviceSid) {
    console.log("name,channelSid,serviceSid", name, channelSid, serviceSid)
    this.selectedChnSid = channelSid;
    this.selectedServiceSid = serviceSid;
    this.client.getChannelByUniqueName(name)
      .then(channel => {
        this.generalChannel = channel;
        this.getChannelMessage(channelSid, serviceSid);
        // Listen for new messages sent to the channel
        this.generalChannel.on('messageAdded', (message) => {
          console.log('calll', message)
          this.getChannelMessage(channelSid, serviceSid);
        });
        // Listen for new messages sent using fire base
        // firebase.messaging().onMessage(payload => {
        //   console.log("wdfgjhfghdhfdhjf,djhdhjf  payload", payload)
        //   this.client.handlePushNotification = payload;
        // });
      }).catch(function (err) {
        console.log(">>>>>>>>>>>>>", err);
        this.toastr.error(err.message)
      });

  

  }
  // getMessage(){

  // }
  // send message to channel with media if this.formData.
  // @param channelSid and serviceSid
  // for media coding is done not able to test because need to change configuration on chat servcice.
  sendMessage(channelSid, serviceSid) {
    console.log('message body', this.messgaeForm.value.message)
    if (this.formData) {
      const msgControl = this.messgaeForm.get('message');
      msgControl.clearValidators();
      msgControl.updateValueAndValidity();
      let inputData = new FormData();
      inputData.append('file', this.messgaeForm.get('mediaUrl').value);
      inputData.append('msg', this.messgaeForm.value.message);
      inputData.append('serviceSid', serviceSid);
      inputData.append('channelSid', channelSid);
      inputData.append('user_id', this.loggedInUserDetails._id);
      let sendedByUserDetail: any = {
        email: this.loggedInUserDetails.email ? this.loggedInUserDetails.email : "",
        firstName: this.loggedInUserDetails.firstName ? this.loggedInUserDetails.firstName : "",
        lastName: this.loggedInUserDetails.lastName ? this.loggedInUserDetails.lastName : "",
        userName: this.loggedInUserDetails.userName ? this.loggedInUserDetails.userName : "",
        clinicName: this.loggedInUserDetails.clinicName ? this.loggedInUserDetails.clinicName : "",
        legalCorporateName: this.loggedInUserDetails.legalCorporateName ? this.loggedInUserDetails.legalCorporateName : "",
        image: this.loggedInUserDetails.image ? this.loggedInUserDetails.image : ""
      }
      inputData.append('sendedByUserDetail', sendedByUserDetail);
    } else {
      var data = {
        serviceSid: serviceSid,
        channelSid: channelSid,
        msg: this.messgaeForm.value.message,
        user_id: this.loggedInUserDetails._id,
        sendedByUserDetail: {
          email: this.loggedInUserDetails.email ? this.loggedInUserDetails.email : "",
          firstName: this.loggedInUserDetails.firstName ? this.loggedInUserDetails.firstName : "",
          lastName: this.loggedInUserDetails.lastName ? this.loggedInUserDetails.lastName : "",
          userName: this.loggedInUserDetails.userName ? this.loggedInUserDetails.userName : "",
          clinicName: this.loggedInUserDetails.clinicName ? this.loggedInUserDetails.clinicName : "",
          legalCorporateName: this.loggedInUserDetails.legalCorporateName ? this.loggedInUserDetails.legalCorporateName : "",
          image: this.loggedInUserDetails.image ? this.loggedInUserDetails.image : ""
        }
      }
    }
    this.chatService.sendMsgToChannel(data).subscribe(res => {
      if (res && res.code == 200 && res.data) {
        console.log("here is send message ... data", res.data);
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else if (res && res.code == 1004) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 1002) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 401) {
        this.toastr.warning(res.message);
      }
    })
    this.getChannelMessage(channelSid, serviceSid);
  }
  getChannelMessage(channelSid, serviceSid) {
    let data = {
      channelSid: channelSid,
      serviceSid: serviceSid
    }
    this.chatService.allMsgInChannel(data).subscribe(res => {
      // console.log("here is yours response", res);
      if (res && res.code == 200 && res.data) {
        // console.log("here is yours data", res.data);
        let tempArr = res.data;
        underscore.map(tempArr, function (data: any) {
          if (data && data.attributes && data.attributes != '') {
            try {
              data.attributes = JSON.parse(data.attributes);
            } catch (err) {
              console.log("some err occured ", err);
            }
          } else {
            console.log('Attribute field is not here');
          }
          return data
        });
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", tempArr)
        this.channelMsgData = tempArr;
        // if (this.showAddParticipants) {
        //   this.totalCount = res.totalCount;
        //   this.pageCountLink = (this.totalCount / this.count);
        //   this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        //   this.pageCountLink = parseInt(this.pageCountLink);
        // }
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else if (res && res.code == 1004) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 1002) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 401) {
        this.toastr.warning(res.message);
      }
    })
  }
  // Funtion getListOfUserAndStaff is used to get the list of all user and staff for associated clinic
  getListOfUserAndStaff() {
    let data = {
      created_by_id: this.userID,
      userType: this.loggedInUserDetails.userType,
      searchText: this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
      clinicName: this.loggedInUserDetails.userType == 'clinic' ? this.loggedInUserDetails.clinicName : '',
      count: this.showAddParticipants ? this.count : 0,
      page: this.showAddParticipants ? this.page : 1,
    }
    this.userService.getListOfUserAndStaff(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code == 200 && res.data) {
        console.log("here is yours data", res.data);
        this.userData = res.data ? res.data : this.userData;
        if (this.showAddParticipants) {
          this.totalCount = res.totalCount;
          this.pageCountLink = (this.totalCount / this.count);
          this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
          this.pageCountLink = parseInt(this.pageCountLink);
        }
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else if (res && res.code == 1004) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 1002) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 401) {
        this.toastr.warning(res.message);
      }
    });
  }
  getGroup() {
    this.isLoading = true;
    let data = {
      created_by_id: this.userID,
      searchText: this.searchUserForm.value.searchText ? this.searchUserForm.value.searchText : '',
      count: this.showAddParticipants ? this.count : 0,
      page: this.showAddParticipants ? this.page : 1,
    }
    this.chatService.groupList(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code == 200 && res.data) {
        console.log("here is yours data of group:::>", res.data);
        this.groupData = res.data ? res.data : this.groupData;
        //   if (this.showAddParticipants) {
        //     this.totalCount = res.totalCount;
        //     this.pageCountLink = (this.totalCount / this.count);
        //     this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        //     this.pageCountLink = parseInt(this.pageCountLink);
        //   }
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else if (res && res.code == 1004) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 1002) {
        this.toastr.warning(res.message);
      } else if (res && res.code == 401) {
        this.toastr.warning(res.message);
      }
    });
  }
  paginate(event) {
    this.page = event.page + 1;
    this.getListOfUserAndStaff();
  }
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  showAddParticipantsModal() {
    this.showAddParticipants = true;
  }
  cancleShowAddParticipants() {
    this.searchUserForm.patchValue({
      searchText: ''
    })
  }
  selectAll() {
    for (var i = 0; i < this.userData.length; i++) {
      this.userData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.userData.every(function (item: any) {
      return item.selected == true;
    })
  }

  // Function is used to create a group.
  createGroup() {
    let temArr = [];
    temArr.push(this.loggedInUserDetails);
    let arrLength = this.userData.length;
    let i = 0;
    for (i; i <= arrLength; i++) {
      if (this.userData[i] && this.userData[i].selected) {
        temArr.push(this.userData[i]);
      }
    }
    this.addGroupForm.value.created_by_id = this.userID;
    this.addGroupForm.value.participants = temArr;
    console.log('sdfdsf', this.addGroupForm.value);
    this.chatService.createGroup(this.addGroupForm.value).subscribe(res => {
      if (res && res.code == 200) {
        if (res.data.length) {
          this.toastr.success(res.message);
          console.log("created group information:::>", res.data);
        }
      } else {
        this.toastr.error(res.message)
      }
    });
  }
  chatHeader(name, img, type) {
    if (type === 'group') {
      this.groupName = name;
      this.imgUrl = img ? this.imageurl + '/uploads/profileImages/' + this.userData.image : this.baseurl + 'assets/images/user.png'
    }
  }
  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      // reader.onload = (event: ProgressEvent) => {
      //   this.imgurl = (<FileReader>event.target).result;
      // }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.messgaeForm.get('mediaUrl').setValue(file);
      console.log("here is my file data please see", file);
      // this.formData = true;
      let inputData = new FormData();
      inputData.append('file', this.messgaeForm.get('mediaUrl').value);
      // inputData.append('msg', this.messgaeForm.value.message);
      inputData.append('content_type', 'multipart/form-data');
      inputData.append('size', file.size);
      inputData.append('file_name', file.name);
      let author: any = {
        sendedByUserDetail: {
          user_id: this.loggedInUserDetails._id,
          email: this.loggedInUserDetails.email ? this.loggedInUserDetails.email : "",
          firstName: this.loggedInUserDetails.firstName ? this.loggedInUserDetails.firstName : "",
          lastName: this.loggedInUserDetails.lastName ? this.loggedInUserDetails.lastName : "",
          userName: this.loggedInUserDetails.userName ? this.loggedInUserDetails.userName : "",
          clinicName: this.loggedInUserDetails.clinicName ? this.loggedInUserDetails.clinicName : "",
          legalCorporateName: this.loggedInUserDetails.legalCorporateName ? this.loggedInUserDetails.legalCorporateName : "",
          image: this.loggedInUserDetails.image ? this.loggedInUserDetails.image : ""
        }
      }
      inputData.append('author', author)
      this.chatClient.getChannelBySid(this.selectedChnSid).then(function (channel) {
        channel.sendMessage(inputData);
      });
      // else{
      //   this.imgurl = this.baseimageurl+'/uploads/profileImages/'+this.imgurl ;
      // }

    }
  }
  // Callback fired if Instance ID token is updated.
  // messaging.onTokenRefresh(function() {
  //   messaging.getToken().then(function(refreshedToken) {
  //     console.log('Token refreshed.');
  //     // Indicate that the new Instance ID token has not yet been sent to the
  //     // app server.
  //     setTokenSentToServer(false);
  //     // Send Instance ID token to app server.
  //     sendTokenToServer(refreshedToken);
  //     // ...
  //   }).catch(function(err) {
  //     console.log('Unable to retrieve refreshed token ', err);
  //     showToken('Unable to retrieve refreshed token ', err);
  //   });
  // });


}
