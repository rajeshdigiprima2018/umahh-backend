/**
 * Created by rv2016 on 17/02/17.
 */

"use strict";

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const path = require('path');
const Faker = require('faker/locale/en_US');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const geoTz = require('geo-tz');
const moment = require('moment-timezone');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var NotificationModel = require('../Models/notification').NotificationModel;
var CalendarModel = require('../Models/calendar').CalendarModel;
var AdminModel = require('../Models/admin').AdminModel;
var baseModel = require('../Models/').TestModel;
var PrayerModel = require('../Models/prayer').PrayerModel;
var UserModel = require('../Models/user').UserModel;
var adminSubs = require('../Models/admin');
const { DefaultDeserializer } = require('v8');

var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

var sendErrorReply = function(err, message, statusCode, reply) {

    return reply({

        success: false,
        error: err,
        message: message
    }).code(statusCode || 404);
};
//Send notifications to all users
var notificationFunctionSendByMosque = function(UserDataToekn, details) {
    var htmlString = details.description;
    // convart html to String
    var notificationSMS = htmlString.replace(/<[^>]+>/g, '');
    //var notificationSMS = details.description;
    var notification = {
        'title': 'Umahh',
        'text': 'One notification',
        'body': notificationSMS
    };
    // fcm device tokens array
    var notification_body = {
        'notification': notification,
        'registration_ids': UserDataToekn,
        //'to': UserDataToekn,
        'icon': 'Media/Images/bell.png'
    }
    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            // replace authorization key with your key
            'Authorization': 'key=AAAATQBaymc:APA91bFzY7xJ2YdDoBO-kCL0agoKI88cK0_BUmMH-FYYKCDAcfiCb6JMXSNfr-3sSxrN_oz-yTAeFbVcvcQ56SjJr74kj-PkzkeTVlVMz9oADV2FzyQbMv4Wd1jpkThZ2cltkZ23-9BG',
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(notification_body)
    }).then(function(response) {
        console.log('response notification', response);
        return;
    }).catch(function(error) {
        console.error(error);
        return;
    })
}
var notificationFunction = function(UserDataToekn, prayerDetails) {
    var notificationSMS = "";
    if (prayerDetails.checkPrayerString == prayerDetails.checkPrayerStringGreterThen) {
        // beforeTime
        notificationSMS = `15 min alert! \n ${prayerDetails.prayerName} is approaching in 15 mins.`;
    } else {
        // currentTime
        notificationSMS = `Countdown is over! \n ${prayerDetails.prayerName}`;
    }
    var notification = {
        'title': 'Umahh',
        'text': 'One notification',
        'body': notificationSMS
    };
    // fcm device tokens array

    var fcm_tokens = ['eTVImk6vdEqGkAezQdF6X3:APA91bHVWByNgaPmDHTBZp8dQrjMrHgUHphwRNRvYoVfl7JiOWAkw7_dMWi45r8rk-WG7E_O8HdR1BVQaOzCYkVOpzVNv66jslmLySkA1PcBkfTRPY1w9pb54ySGssfc9c9cC_uN5ixL'];
    var notification_body = {
        'notification': notification,
        'registration_ids': UserDataToekn,
        //'to': UserDataToekn,
        'icon': 'Media/Images/bell.png'
    }
    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            // replace authorization key with your key
            'Authorization': 'key=AAAATQBaymc:APA91bFzY7xJ2YdDoBO-kCL0agoKI88cK0_BUmMH-FYYKCDAcfiCb6JMXSNfr-3sSxrN_oz-yTAeFbVcvcQ56SjJr74kj-PkzkeTVlVMz9oADV2FzyQbMv4Wd1jpkThZ2cltkZ23-9BG',
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(notification_body)
    }).then(function(response) {
        console.log('response notification', response);
        return;
    }).catch(function(error) {
        console.error(error);
        return;
    })
};
var notificationFunctionCalender = function(UserDataToekn) {
    var notification = {
        'title': 'Umahh',
        'text': 'One notification',
        'body': 'hhiii'
    };
    // fcm device tokens array

    var fcm_tokens = ['eTVImk6vdEqGkAezQdF6X3:APA91bHVWByNgaPmDHTBZp8dQrjMrHgUHphwRNRvYoVfl7JiOWAkw7_dMWi45r8rk-WG7E_O8HdR1BVQaOzCYkVOpzVNv66jslmLySkA1PcBkfTRPY1w9pb54ySGssfc9c9cC_uN5ixL'];
    var notification_body = {
        'notification': notification,
        'registration_ids': UserDataToekn,
        //'to': UserDataToekn,
        'icon': 'Media/Images/bell.png'
    }
    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            // replace authorization key with your key
            'Authorization': 'key=AAAATQBaymc:APA91bFzY7xJ2YdDoBO-kCL0agoKI88cK0_BUmMH-FYYKCDAcfiCb6JMXSNfr-3sSxrN_oz-yTAeFbVcvcQ56SjJr74kj-PkzkeTVlVMz9oADV2FzyQbMv4Wd1jpkThZ2cltkZ23-9BG',
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(notification_body)
    }).then(function(response) {
        console.log('response notification', response);
        return;
    }).catch(function(error) {
        console.error(error);
        return;
    })
};
var sendNotification = function(reply) {
    const aFunc = async function() {
        try {
            //getData all mosque prayer
            const nowData = moment.tz(moment(), 'HH:mm:ss', 'UTC').format();
            const getHours = moment.utc(nowData).get('hours');
            const getMinutes = moment.utc(nowData).get('minutes');
            var getLessThenTime = moment.utc().subtract(moment.duration(15, 'minutes'));
            const getHoursLessThen = moment.utc(getLessThenTime).get('hours');
            const getMinutesLessThen = moment.utc(getLessThenTime).get('minutes');
            const checkPrayerStringLessThen = getHoursLessThen * 60 + getMinutesLessThen;
            const checkPrayerStringGreterThen = getHours * 60 + getMinutes;
            // const getData = await PrayerModel.find({ checkPrayerString: { $gte: checkPrayerStringGreterThen, $lt: checkPrayerStringLessThen } });
            // const getData = await PrayerModel.find({ checkPrayerString: { $eq: checkPrayerStringGreterThen } });
            const getData = await PrayerModel.find({ $or: [{ checkPrayerString: { $eq: checkPrayerStringGreterThen } }, { checkPrayerStringCurrent: checkPrayerStringGreterThen }] }).populate('prayercategoryId', 'name arabic_name')
            console.log('getData nagar', getData);
            if (getData.length > 0) {
                getData.forEach(async element => {
                    console.log('element', element);
                    const getUserData = await UserModel.find({ "mosque_id": element.mosque_id })
                        .select('deviceToken');
                    if (getUserData.length > 0) {
                        const UserDataToekn = [];
                        getUserData.forEach(async getUserToken => {
                            if (getUserToken.deviceToken !== null) {
                                await UserDataToekn.push(getUserToken.deviceToken);
                            } else {
                                //console.log('else getUser');
                            }
                        });
                        if (UserDataToekn.length > 0) {
                            const prayerDetails = {
                                time: element.time,
                                arabic_name: element.prayercategoryId.arabic_name,
                                prayerName: element.prayercategoryId.name,
                                checkPrayerString: element.checkPrayerString,
                                checkPrayerStringCurrent: element.checkPrayerStringCurrent,
                                checkPrayerStringGreterThen: checkPrayerStringGreterThen
                            }
                            notificationFunction(UserDataToekn, prayerDetails);
                            return
                        }
                    } else {
                        console.log('else mosque');
                    }
                })
            } else {
                return
            }
        } catch (error) {
            return reply({
                success: false,
                message: "Notification not found"
            }).code(500);
        }
    };
    execute(aFunc);
}
var sendNotificationCalender = function(reply) {

        const aFunc = async function() {

            try {
                //getData all mosque prayer

                var DateToday = new Date();
                var lessThenDate = new Date();
                lessThenDate.setDate(DateToday.getDate() - 1);

                var graterThenDate = new Date();
                graterThenDate.setDate(DateToday.getDate() + 1);
                console.log("lessThenDate", lessThenDate);
                console.log("graterThenDate", graterThenDate);
                const getData = await CalendarModel.find({
                    calendarDate: { $gte: lessThenDate, $lt: graterThenDate }
                });
                if (getData.length > 0) {
                    console.log('else getData', getData);
                    getData.forEach(async element => {
                        const getUserData = await UserModel.find({ "mosque_id": element.mosque_id })
                            .select('deviceToken');
                        if (getUserData.length > 0) {
                            const UserDataToekn = [];
                            getUserData.forEach(async getUserToken => {
                                if (getUserToken.deviceToken !== null) {
                                    await UserDataToekn.push(getUserToken.deviceToken);
                                } else {
                                    console.log('else getUser');
                                }

                            });
                            if (UserDataToekn.length > 0) {
                                console.log('UserDataToekn', UserDataToekn);
                                notificationFunctionCalender(UserDataToekn);
                                return
                            }

                        } else {
                            console.log('else mosque');
                        }
                    })

                } else {
                    return reply({
                        success: false,
                        message: "Prayer not found"
                    }).code(200);
                }

            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification not found"
                }).code(500);
            }

        };
        execute(aFunc);
    }
    // setInterval(sendNotification, 7200000);
    // setInterval(sendNotificationCalender, 18000000);
setInterval(sendNotification, 60000);
setInterval(sendNotificationCalender, 18000000);
module.exports.funcs_notification = {

    getNotiByReviceId: function(request, reply) {
        const aFunc = async function() {
            try {
                let authUser = helpers_generic.getCurrentAuthUser();
                const getUserData = await UserModel.findById({ "_id": request.params.reciveUserId })
                if (getUserData.mosque_id != null) {
                    let sorting = { createdAt: -1 };
                    const getAllNotification = await NotificationModel.find({ send_id: getUserData.mosque_id }).populate("send_id", "username role").sort(sorting);
                    if (getAllNotification) {
                        return reply({
                            code: 200,
                            success: true,
                            data: getAllNotification,
                            message: "Notification list find successfully."
                        }).code(200);
                    } else {
                        return reply({
                            code: 200,
                            success: true,
                            data: [],
                            message: "Notification not available"
                        }).code(200);
                    }
                } else {
                    return reply({
                        code: 200,
                        success: true,
                        data: [],
                        message: "Notification not available"
                    }).code(200);
                }
            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification not available"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getNotificationByIdWeb: function(request, reply) {
        const aFunc = async function() {
            try {
                //get all mosque Board by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await NotificationModel.find({ send_id: request.params.send_id }).count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }
                const getAllData = await NotificationModel.find({ send_id: request.params.send_id })
                    .populate('send_id', 'username')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    totalCount: totCount,
                    message: "All Notification fetch list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification data not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getNotification: function(request, reply) {
        const aFunc = async function() {
            try {
                //get mosque Board details id
                const getData = await NotificationModel.findById(request.params._id);
                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Get notification details successfully."
                }).code(200);
            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification details not found"
                }).code(500);
            }
        };
        execute(aFunc);
    },

    addNotification: function(request, reply) {
        const aFunc = async function() {
            try {
                var data = request.payload;
                let authUser = helpers_generic.getCurrentAuthUser();
                // if(authUser){
                const docObject = request.payload;
                let newObjectAdd = new NotificationModel(docObject);
                let notificationSave = await newObjectAdd.save();
                if (notificationSave) {
                    reply({
                        code: 200,
                        message: 'Notification Send succesfully',
                        success: true,
                        data: notificationSave,
                    });
                    const mosqueId = notificationSave.send_id;
                    // find all user by mosque_id
                    const getAllUserData = await UserModel.find({ "mosque_id": mosqueId }).select('deviceToken');
                    if (getAllUserData.length > 0) {
                        // store device Token All user
                        const UserDataToekn = [];
                        getAllUserData.forEach(async getUserToken => {
                            if (getUserToken.deviceToken !== null) {
                                await UserDataToekn.push(getUserToken.deviceToken);
                            } else { //console.log('else getUser');
                            }
                        });
                        if (UserDataToekn.length > 0) {
                            const details = { description: notificationSave.description }
                            notificationFunctionSendByMosque(UserDataToekn, details);
                            return
                        }
                    } else {
                        //console.log('else mosque');
                    }
                } else {
                    reply({
                        code: 500,
                        message: 'Notification Not Send',
                        success: false,
                    });
                }
                //}
            } catch (error) {
                return reply({
                    success: false,
                    message: error
                }).code(500);
            }
        };
        execute(aFunc);
    },

    /*    modifyQuiz    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //update mosque Board by Board id

                    const modifyData = await QuizModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   modifyData,
                        message     :   "Quiz updated successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "Quiz not updated"
                    }).code(500);
                }

            };
            execute(aFunc);
        }, */

    deleteNotification: function(request, reply) {
        console.log('request.params', request.params);
        const aFunc = async function() {
            try {
                //delete mosque Board by Board id
                const deleteData = await NotificationModel.remove({ _id: request.params._id });
                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Notification deleted successfully."
                }).code(200);
            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification not found"
                }).code(500);
            }
        };
        execute(aFunc);
    },

    sendNotificationCalender: function(request, reply) {

        const aFunc = async function() {

            try {
                //getData all mosque prayer

                var DateToday = new Date();
                var lessThenDate = new Date();
                lessThenDate.setDate(DateToday.getDate() - 1);

                var graterThenDate = new Date();
                graterThenDate.setDate(DateToday.getDate() + 1);
                console.log("lessThenDate", lessThenDate);
                console.log("graterThenDate", graterThenDate);
                const getData = await CalendarModel.find({
                    calendarDate: { $gte: lessThenDate, $lt: graterThenDate }
                });
                if (getData.length > 0) {
                    console.log('else getData', getData);
                    getData.forEach(async element => {
                        const getUserData = await UserModel.find({ "mosque_id": element.mosque_id })
                            .select('deviceToken');
                        if (getUserData.length > 0) {
                            const UserDataToekn = [];
                            getUserData.forEach(async getUserToken => {
                                if (getUserToken.deviceToken !== null) {
                                    await UserDataToekn.push(getUserToken.deviceToken);
                                } else {
                                    console.log('else getUser');
                                }

                            });
                            if (UserDataToekn.length > 0) {
                                console.log('UserDataToekn', UserDataToekn);
                                notificationFunctionCalender(UserDataToekn);
                                return reply({
                                    success: false,
                                    message: "Notification send successfully"
                                }).code(200);
                            }

                        } else {
                            console.log('else mosque');
                        }
                    })

                } else {
                    return reply({
                        success: false,
                        message: "Prayer not found"
                    }).code(200);
                }

            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification not found"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    sendNotification: function(request, reply) {
        const aFunc = async function() {
            try {
                //getData all mosque prayer
                const nowData = moment.tz(moment(), 'HH:mm:ss', 'UTC').format();
                const getHours = moment.utc(nowData).get('hours');
                const getMinutes = moment.utc(nowData).get('minutes');
                var getLessThenTime = moment.utc().subtract(moment.duration(15, 'minutes'));
                const getHoursLessThen = moment.utc(getLessThenTime).get('hours');
                const getMinutesLessThen = moment.utc(getLessThenTime).get('minutes');
                const checkPrayerStringLessThen = getHoursLessThen * 60 + getMinutesLessThen;
                const checkPrayerStringGreterThen = getHours * 60 + getMinutes;
                // const getData = await PrayerModel.find({ checkPrayerString: { $gte: checkPrayerStringGreterThen, $lt: checkPrayerStringLessThen } });
                // const getData = await PrayerModel.find({ checkPrayerString: { $eq: checkPrayerStringGreterThen } });
                const getData = await PrayerModel.find({ $or: [{ checkPrayerString: { $eq: checkPrayerStringGreterThen } }, { checkPrayerStringCurrent: checkPrayerStringGreterThen }] }).populate('prayercategoryId', 'name arabic_name')
                console.log('getData nagar', getData);
                if (getData.length > 0) {
                    getData.forEach(async element => {
                        //console.log('element', element);
                        const getUserData = await UserModel.find({ "mosque_id": element.mosque_id })
                            .select('deviceToken');
                        if (getUserData.length > 0) {
                            const UserDataToekn = [];
                            getUserData.forEach(async getUserToken => {
                                if (getUserToken.deviceToken !== null) {
                                    await UserDataToekn.push(getUserToken.deviceToken);
                                } else {
                                    //console.log('else getUser');
                                }
                            });
                            if (UserDataToekn.length > 0) {
                                const prayerDetails = {
                                    time: element.time,
                                    arabic_name: element.prayercategoryId.arabic_name,
                                    prayerName: element.prayercategoryId.name,
                                    checkPrayerString: element.checkPrayerString,
                                    checkPrayerStringCurrent: element.checkPrayerStringCurrent,
                                    checkPrayerStringGreterThen: checkPrayerStringGreterThen
                                }
                                notificationFunction(UserDataToekn, prayerDetails);
                                return
                            }
                        } else {
                            console.log('else mosque');
                        }
                    })
                } else {
                    return
                }
            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification not found"
                }).code(500);
            }
        };
        execute(aFunc);
    },
    getAllMosqueLatLongAndUpdateTimeZone: function(request, reply) {
        const aFunc = async function() {
            try {
                /*                 var notification = {
                                    'title': 'Umahhh',
                                    'text': 'One notification'
                                };
                                // fcm device tokens array
                                var fcm_tokens = 'dwt0QUxW8kcvpUfm3qZUzL:APA91bHcPPj8ecDM_bOmz8okhVESqMKeY6xP6wxAv2oOIL6WqBVLSLLM4PaTk-KoATySPbVNzbLLpWPxht3YYR-tahqnxVpTWF6IJ9frU38xZwCwY1b66QqZmZD48R0bRJCFNNKGkY1J'
                                var notification_body = {
                                    'notification': notification,
                                    'to': fcm_tokens
                                }
                                fetch('https://fcm.googleapis.com/fcm/send', {
                                    'method': 'POST',
                                    'headers': {
                                    // replace authorization key with your key
                                    'Authorization': 'key=AAAAEOV1W-4:APA91bFPyX9xVwNgRfWr9ELSQ-9zwyBmSQDBqLQ8m8ePHSOaWpLCMutss9o7Sd78kWWZOoNwfkQuK4xJo7sxUOZI_0jkEIgm-2XwGGYd-QHwX3TgH8QxXXMrcWDREIm9UQ2IhNY_A_kM',
                                    'Content-Type': 'application/json'
                                },
                                'body': JSON.stringify(notification_body)
                                }).then(function(response) {
                                    console.log(response);
                                }).catch(function(error) {
                                    console.error(error);
                                }) */

                //delete mosque Board by Board id
                const getDataMosque = await UserModel.find({ "role": "mosque" }).select('geometry user_id timezone');
                // console.log('getDataMosque', getDataMosque);
                var i = 0;
                getDataMosque.forEach(async element => {
                    console.log('user_id', element.geometry.location.lat);
                    const timezone = await geoTz(element.geometry.location.lat, element.geometry.location.lng);
                    console.log('timezone', timezone);
                    console.log('user_id', element.user_id);
                    console.log('timezone', timezone);
                    await UserModel.findByIdAndUpdate({ _id: element.user_id }, { timezone: timezone[0] });
                });
                return reply({
                    code: 200,
                    success: true,
                    data: getDataMosque,
                    message: "Notification deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Notification not found"
                }).code(500);
            }

        };
        execute(aFunc);
    },
}