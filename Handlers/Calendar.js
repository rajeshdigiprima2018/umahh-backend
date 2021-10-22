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
const Path = require('path');
const Faker  = require('faker/locale/en_US');
const moment = require('moment-timezone');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var CalendarModel = require('../Models/calendar').CalendarModel;
var AdminModel = require('../Models/admin').AdminModel;
var baseModel = require('../Models/').TestModel;
var adminSubs = require('../Models/admin');
var UserModel = require('../Models/user').UserModel;
var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}

module.exports.funcs_Calendar     =   {

    getCalendarByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                const getMosque = await UserModel.findById({_id: request.params.mosque_id})
                .select('timezone');
                const getAllData = await CalendarModel.find({mosque_id: request.params.mosque_id});
                if(getMosque.timezone !==null && getAllData.length > 0)
                {
                    const newArrayData = [];
                    getAllData.forEach( async element =>  {
                        var calendarDateNew = moment.tz(element.calendarDate, "Asia/Kolkata").format('YYYY-MM-DD'); 
                        const datenewadd = calendarDateNew+"T06:13:26.857Z";
                        newArrayData.push({
                            "calendarDate": datenewadd,
                            "title": element.title,
                            "calendarTime": element.calendarTime,
                            "createdAt": element.createdAt,
                            "deletedAt": element.deletedAt,
                            "updatedAt": element.updatedAt,
                            "mosque_id": element. mosque_id,
                            "Calendar_id": element.Calendar_id,
                            "id": element.id
                            }); 
                    });
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   newArrayData,
                        message     :   "Mosque Calendar all list successfully."
                    }).code(200);
                }
                else
                {
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        message     :   "Mosque Calendar all list successfully."
                    }).code(200);
                }
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Mosque Calendar all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Calendar not found"
                }).code(500);
            } 

        };
        execute(aFunc);

    },

    getCalendarByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                let authUser =  helpers_generic.getCurrentAuthUser();
                if(authUser.role =='admin'){
                    //get all mosque Calendar by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await CalendarModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await CalendarModel.find().populate('user_id')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Calendar all list successfully."
                    }).code(200);
                }
                else
                {
                         //get all mosque Calendar by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await CalendarModel.find({mosque_id: request.params.mosque_id}).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await CalendarModel.find({mosque_id: request.params.mosque_id}).populate('user_id')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Calendar all list successfully."
                    }).code(200);

                }    

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Calendar not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getCalendar    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque Calendar details id
                const getData = await CalendarModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Mosque Calendar list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Calendar not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addCalendar    :   function(request, reply) {

        const aFunc = async function(){
            try {

                //add mosque Calendar and mosque id
                const Calendar = new CalendarModel(request.payload);
                const result = await Calendar.save();
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   result,
                    message     :   "Mosque Calendar add successfully."
                }).code(200);


            } catch (error) {

                return reply({
                success     :   false,
                message     :   error
                }).code(500);
            }

        };

        execute(aFunc);

    },

    modifyCalendar    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque Calendar by Calendar id

                const modifyData = await CalendarModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque Calendar updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Calendar not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteCalendar    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Calendar by Calendar id
                const deleteData = await CalendarModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Mosque Calendar deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Calendar not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    }  
}