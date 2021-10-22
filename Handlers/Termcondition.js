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


var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var TermconditionModel = require('../Models/terncondition').TermconditionModel;
var AdminModel = require('../Models/admin').AdminModel;
var baseModel = require('../Models/').TestModel;
var adminSubs = require('../Models/admin');

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

module.exports.funcs_termc     =   {

    getTermByAdmin    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                let authUser =  helpers_generic.getCurrentAuthUser();

                //get all mosque News by mosque id
              //  if(authUser){

                    const getAllTermcondition = await TermconditionModel.find();
                    if(getAllTermcondition){
                        return reply({
                            code: 200,
                            success     :   true,
                            data        :   getAllTermcondition,
                            message     :   "Termcondition list find successfully."
                        }).code(200);
                    }else{
                        return reply({
                            code: 200,
                            success     :   true,
                            data        :   [],
                            message     :   "Termcondition not available"
                        }).code(200);


                    }    
            //    }
            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Termcondition not available"
                }).code(500);
            }

        };
        execute(aFunc);

    },

   getTermconditionByIdWeb  :   function(request, reply) {

        const aFunc = async function(){
            try {
                //get all mosque Board by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await TermconditionModel.find().count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }
                const getAllData = await TermconditionModel.find()
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    totalCount  :   totCount,
                    message     :   "All Termcondition fetch list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Termcondition data not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getTermcondition    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque Board details id
                const getData = await TermconditionModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Get TermconditionModel details successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "TermconditionModel details not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addTermcondition    :   function(request, reply) {

        const aFunc = async function(){
            try {

                var data = request.payload;
                
                let authUser =  helpers_generic.getCurrentAuthUser();

               // if(authUser){
                    const docObject = request.payload;    
                    let newObjectAdd = new TermconditionModel(docObject)
                    let notificationSave  = await newObjectAdd.save();
                    if(notificationSave){
                        reply({
                            code: 200,
                            message: 'Added succesfully',
                            success: true,
                            data: notificationSave,
                        });

                    }else{
                        reply({
                            code: 500,
                            message: 'Not added',
                            success: false,
                        });
                    }

                //}

            } catch (error) {

                return reply({
                success     :   false,
                message     :   error
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

    deleteNotification    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Board by Board id
                const deleteData = await NotificationModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Notification deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Notification not found"
                }).code(500);
            }

        };
        execute(aFunc);
    }
}