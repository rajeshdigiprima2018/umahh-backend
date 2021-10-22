/**
 * Created by rv2016 on 05/06/17.
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
const Path = require('path');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers; // require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
//var MenuItemModel = require('../Models/menuitem').menuItemModel;
var PrayerModel = require('../Models/prayer').PrayerModel;

const Mailer = require('./Mailer').funcs_mail;

const appConfig = require('../ENV').prefs;


var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

var sendErrorReply = function(err, message, statusCode, reply) {

    return reply({

        success: false,
        error: err,
        message: message
    }).code(statusCode || 404);
}

var saveData = function(userObject, projection, options, logMessage, reply, callback) {

    userObject.save(function(err, savedDoc, numRowsAffected) {

        if (savedDoc && err == null && numRowsAffected > 0) {

            callback(null, savedDoc);
        } else if (err != null || numRowsAffected == 0) {

            callback(err, null);

            return sendErrorReply(err != null ? err.message : "Error occurred saving Model Data",
                logMessage, 404, reply);

        } else {

            return sendErrorReply("Unknown Server Error occurred saving Model Data",
                logMessage, 404, reply);
        }

    });
}


module.exports.funcs_s = {

    getprayerByMosqueId: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all mosque prayer by mosque id

                var timeInMss = new Date().getTime();

                let sorting = { sort: 1 };
                const getAllData = await PrayerModel.find({ mosque_id: request.params.mosque_id })
                    .populate('prayercategoryId', 'name arabic_name')
                    .sort(sorting)
                    .lean();
                if (getAllData.length > 0) {
                    const modifyArray = [];
                    getAllData.forEach(element => {
                        let pbjectPush = {
                            "_id": element._id,
                            "updatedAt": element.updatedAt,
                            "deletedAt": element.deletedAt,
                            "createdAt": element.createdAt,
                            "status": element.status,
                            "mosque_id": element.mosque_id,
                            "time": element.time,
                            "day_aerobic": element.prayercategoryId.arabic_name,
                            "day": element.prayercategoryId.name,
                            "__v": 0
                        }
                        modifyArray.push(pbjectPush);
                    });

                    return reply({
                        code: 200,
                        success: true,
                        data: modifyArray,
                        message: "Mosque prayer all list successfully."
                    }).code(200);

                } else {
                    return reply({
                        code: 200,
                        success: true,
                        data: [],
                        message: "Mosque prayer not found."
                    }).code(200);

                }


            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque prayer not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getprayerByMosqueIdWeb: function(request, reply) {

        const aFunc = async function() {

            try {
                let authUser = helpers_generic.getCurrentAuthUser();
                if (authUser.role == 'admin') {
                    //get all mosque prayer by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { sort: 1 };
                    let totCount;
                    const getCount = await PrayerModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await PrayerModel.find()
                        .populate('prayercategoryId', 'name arabic_name')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();

                    return reply({
                        code: 200,
                        success: true,
                        data: getAllData,
                        totalCount: totCount,
                        message: "Mosque prayer all list successfully."
                    }).code(200);

                } else {
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { sort: 1 };
                    let totCount;
                    const getCount = await PrayerModel.find({ mosque_id: request.params.mosque_id }).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await PrayerModel.find({ mosque_id: request.params.mosque_id })
                        .populate('prayercategoryId', 'name arabic_name')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();

                    return reply({
                        code: 200,
                        success: true,
                        data: getAllData,
                        totalCount: totCount,
                        message: "Mosque prayer all list successfully."
                    }).code(200);


                }

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getprayer: function(request, reply) {

        const aFunc = async function() {

            try {

                //get mosque prayer details by id
                const getData = await PrayerModel.findById(request.params._id)
                    .populate('prayercategoryId', 'name arabic_name');
                let pbjectPush = {
                    "day_aerobic": getData.prayercategoryId.arabic_name,
                    "day": getData.prayercategoryId.name,
                    "time": getData.time,
                    "sort": getData.sort,
                    "mosque_id": getData.mosque_id,
                    "status": getData.status,
                    "updatedAt": getData.updatedAt,
                    "deletedAt": getData.deletedAt,
                    "createdAt": getData.createdAt,
                    "prayer_id": getData.prayer_id,
                    "prayerNameId": getData.prayercategoryId._id
                }

                return reply({
                    code: 200,
                    success: true,
                    data: pbjectPush,
                    message: "Mosque prayer list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addprayer: function(request, reply) {
        const aFunc = async function() {
            try {
                const getFindData = await PrayerModel.findOne({ "prayercategoryId": request.payload.prayercategoryId, "mosque_id": request.payload.mosque_id });
                const nowData11 = request.payload.checkPrayerString;
                const getHoursCurrent = moment.utc(nowData11).get('hours');
                const getMinutesCurrent = moment.utc(nowData11).get('minutes');
                const checkPrayerStringCurrent = getHoursCurrent * 60 + getMinutesCurrent;
                var getLessThenTime = moment.utc(nowData11).subtract(moment.duration(15, 'minutes'));
                const getHoursLessThen = moment.utc(getLessThenTime).get('hours');
                const getMinutesLessThen = moment.utc(getLessThenTime).get('minutes');
                const checkPrayerStringaa = getHoursLessThen * 60 + getMinutesLessThen;
                const objectData = {
                        "prayercategoryId": request.payload.prayercategoryId,
                        "time": request.payload.time,
                        "sort": request.payload.sort,
                        "mosque_id": request.payload.mosque_id,
                        "staticTime": request.payload.staticTime,
                        "offset": request.payload.offset,
                        "startHour": getHoursLessThen,
                        "startMinutes": getMinutesLessThen,
                        "checkPrayerString": checkPrayerStringaa,
                        "checkPrayerStringCurrent": checkPrayerStringCurrent
                    }
                    // console.log('objectData', objectData);
                const prayer = new PrayerModel(objectData);
                const result = await prayer.save();
                return reply({
                    code: 200,
                    success: true,
                    data: result,
                    message: "Mosque prayer add successfully."
                }).code(200);
            } catch (error) {
                return reply({
                    success: false,
                    message: error
                }).code(500);
            }
        };
        execute(aFunc);
    },

    modifyprayer: function(request, reply) {
        const aFunc = async function() {
            try {
                //update mosque prayer by prayer id
                // const getHours = new Date(request.payload.staticTime).getHours();
                // const getMinutes = new Date(request.payload.staticTime).getMinutes();
                // const checkPrayerString = getHours * 60 + getMinutes;
                const nowData11 = request.payload.checkPrayerString;
                const getHoursCurrent = moment.utc(nowData11).get('hours');
                const getMinutesCurrent = moment.utc(nowData11).get('minutes');
                const checkPrayerStringCurrent = getHoursCurrent * 60 + getMinutesCurrent;
                var getLessThenTime = moment.utc(nowData11).subtract(moment.duration(15, 'minutes'));
                const getHoursLessThen = moment.utc(getLessThenTime).get('hours');
                const getMinutesLessThen = moment.utc(getLessThenTime).get('minutes');
                const checkPrayerStringaa = getHoursLessThen * 60 + getMinutesLessThen;
                const objectData = {
                        "prayercategoryId": request.payload.prayercategoryId,
                        "time": request.payload.time,
                        "sort": request.payload.sort,
                        // "mosque_id": request.payload.mosque_id,
                        "staticTime": request.payload.staticTime,
                        "offset": request.payload.offset,
                        "startHour": getHoursLessThen,
                        "startMinutes": getMinutesLessThen,
                        "checkPrayerString": checkPrayerStringaa,
                        "checkPrayerStringCurrent": checkPrayerStringCurrent
                    }
                    // const objectData = {
                    //     "prayercategoryId": request.payload.prayercategoryId,
                    //     "time": request.payload.time,
                    //     "sort": request.payload.sort,
                    //     "staticTime": request.payload.staticTime,
                    //     "offset": request.payload.offset,
                    //     "startHour": getHours,
                    //     "startMinutes": getMinutes,
                    //     "checkPrayerString": checkPrayerString
                    // }
                const modifyData = await PrayerModel.findByIdAndUpdate(request.params._id, objectData, { new: true });
                return reply({
                    code: 200,
                    success: true,
                    data: modifyData,
                    message: "Mosque prayer updated successfully."
                }).code(200);
            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque prayer not updated"
                }).code(500);
            }
        };
        execute(aFunc);
    },

    deleteprayer: function(request, reply) {

        const aFunc = async function() {

            try {


                //delete mosque prayer by prayer id
                const deleteData = await PrayerModel.remove({ _id: request.params._id });
                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Mosque prayer deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },

}