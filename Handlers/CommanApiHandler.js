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
const bcrypt     = require('bcryptjs');

var helpers_generic =  require('./yummzHandlers').funcs_g.YZHandlers;// require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
//var MenuItemModel = require('../Models/menuitem').menuItemModel;
var PrayerNameModel = require('../Models/prayerName').PrayerNameModel;

const Mailer = require('./Mailer').funcs_mail;

const appConfig =   require('../ENV').prefs;


var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}

var saveData =   function(userObject,projection, options, logMessage ,reply, callback){

    userObject.save(function(err, savedDoc, numRowsAffected){

        if(savedDoc && err == null && numRowsAffected  > 0){

            callback(null, savedDoc);
        }
        else if(err != null || numRowsAffected == 0){

            callback(err, null);

            return sendErrorReply(err != null ? err.message : "Error occurred saving Model Data",
                logMessage, 404,reply );

        }
        else{

            return sendErrorReply("Unknown Server Error occurred saving Model Data",
                logMessage, 404,reply );
        }

    });
}


module.exports.funcs_comman = {

    getprayerByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque prayer by mosque id

                const getAllData = await PrayerNameModel.find({mosque_id: request.params.mosque_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Mosque prayer all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getprayerByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque prayer by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await PrayerNameModel.find({mosque_id: request.params.mosque_id}).count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await PrayerNameModel.find({mosque_id: request.params.mosque_id})
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    totalCount  :   totCount,
                    message     :   "Mosque prayer all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getprayername    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque prayer details by id
                const getData = await PrayerNameModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Mosque prayer list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addprayer    :   function(request, reply) {

        const aFunc = async function(){
            try {

                //add mosque prayer and mosque id
                const prayer = new PrayerNameModel(request.payload);
                const result = await prayer.save();
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   result,
                    message     :   "Mosque prayer add successfully."
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

    modifyprayer    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque prayer by prayer id


                const modifyData = await PrayerNameModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque prayer updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteprayer    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                
                //delete mosque prayer by prayer id
                const deleteData = await PrayerNameModel.remove({_id:request.params._id});
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Mosque prayer deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque prayer not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    }, 

}