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
var PaymentModel = require('../Models/payment').PaymentModel;
//var MenuItemModel = require('../Models/menuitem').menuItemModel;
var TransferPaymentToMosqueModel = require('../Models/transferPaymentToMosque').TransferPaymentToMosqueModel;

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


module.exports.funcs_transfer = {

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
    getTrasactionByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                //Transfer payment get al by mosque
                let authUser =  helpers_generic.getCurrentAuthUser();
                //console.log('check admin', authUser);
                if(authUser){

                    //get all mosque prayer by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await TransferPaymentToMosqueModel.find({$and:[{mosqueId: authUser.user_id},{isDeleted: null}]}).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }
                    const getAllDatatrasaction = await TransferPaymentToMosqueModel.find({$and:[{mosqueId: authUser.user_id},{isDeleted: null}]})
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllDatatrasaction,
                        totalCount  :   totCount,
                        message     :   "Get All payment list successfully."
                    }).code(200);
                }else{
                    return reply({
                        code: 400,
                        success     :   false,
                        message     :   "You are not Authonticate user."
                    }).code(400);
                }    

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

    addPaymentAdminToMosque    :   function(request, reply) {

        const aFunc = async function(){
            try {
                
                //Transfer payment admin to mosque
                let authUser =  helpers_generic.getCurrentAuthUser();
                //console.log('check admin', authUser);
                if(authUser){
                    //check textid and mosque id this amount
                    const textIdData = await PaymentModel.findOne({$and:[{"txn_id" : request.payload.textId},{"mosque_id" : request.payload.mosqueId} ]});
                    const textIdDataStatus = await PaymentModel.findOne({$and:[{"txn_id" : request.payload.textId},{"status" : 1} ]});
                    if(textIdDataStatus !== null){
                        return reply({
                            code: 200,
                            success     :   true,
                            data : null,
                            message     :   "There has already been payment here."
                        }).code(200);
                    }
                    if(textIdData !== null){
                        const addTransferPayment = {
                            "mosqueId" : request.payload.mosqueId,
                            "adminId"   :authUser.user_id,
                            "textId"    : request.payload.textId,
                            "amount"    : (Math.round(request.payload.amount * 100) / 100).toFixed(2) 
                        }

                        await PaymentModel.update(
                            {$and:[{"txn_id" : request.payload.textId},{"mosque_id" : request.payload.mosqueId} ]},
                            { $set: { status: 1 }},
                            { multi: true }
                          )
                        const amountSave = new TransferPaymentToMosqueModel(addTransferPayment);
                        const result = await amountSave.save();
                        return reply({
                            code: 200,
                            success     :   true,
                            data        :   result,
                            message     :   "Your transaction successfully."
                        }).code(200);

                    }else{
                        return reply({
                            code: 200,
                            success     :   true,
                            data        :   result,
                            message     :   "This transfer textId and mosque not verify."
                        }).code(200);
                    }
                }else{
                    return reply({
                        code: 400,
                        success     :   false,
                        message     :   "You are not Authonticate user."
                    }).code(400);
                }
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