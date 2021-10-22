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
const Faker = require('faker/locale/en_US');


var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var MessageModel = require('../Models/message').MessageModel;
var UserModel = require('../Models/user').UserModel;
var AdminModel = require('../Models/admin').AdminModel;
var baseModel = require('../Models/').TestModel;
var adminSubs = require('../Models/admin');

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
}

module.exports.funcs_message = {

    getMessageByReviceId: function(request, reply) {

        const aFunc = async function() {

            try {
                let authUser = helpers_generic.getCurrentAuthUser();

                //get all mosque News by mosque id
                if (authUser) {

                    const getAllMessage = await MessageModel.find({
                        "send_id": { "$in": [authUser._id, request.params.reciveUserId] },
                        "recive_id": { "$in": [authUser._id, request.params.reciveUserId] }
                    }); //.populate("send_id", "username role");
                    if (getAllMessage) {
                        return reply({
                            code: 200,
                            success: true,
                            data: getAllMessage,
                            count: getAllMessage.length,
                            message: "Message list find successfully."
                        }).code(200);
                    } else {
                        return reply({
                            code: 200,
                            success: true,
                            count: 0,
                            data: [],
                            message: "Message not available"
                        }).code(200);


                    }
                }
            } catch (error) {
                return reply({
                    success: false,
                    message: "Message not available"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getMessageAllUserList: function(request, reply) {

        const aFunc = async function() {

            try {
                //get all mosque Board by mosque id

                const getAllData = await UserModel.find({ "role": { "$in": ["mosque", "admin"] } })
                    .select('username role createdAt avtar')
                    .exec();
                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    message: "All User fetch list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "User data not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    /*    getNotification    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get mosque Board details id
                    const getData = await MessageModel.findById(request.params._id);

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getData,
                        message     :   "Get notification details successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "Notification details not found"
                    }).code(500);
                }

            };
            execute(aFunc);

        },*/

    addMessage: function(request, reply) {

        const aFunc = async function() {
            try {

                var data = request.payload;

                let authUser = helpers_generic.getCurrentAuthUser();
                console.log('authUser', authUser);

                if (authUser) {
                    const docObject = {
                        "send_id": authUser._id,
                        "recive_id": request.payload.recive_id,
                        "description": request.payload.description
                    };
                    let newObjectAdd = new MessageModel(docObject)
                    let notificationSave = await newObjectAdd.save();
                    if (notificationSave) {
                        reply({
                            code: 200,
                            message: 'Message Send succesfully',
                            success: true,
                            data: notificationSave,
                        });

                    } else {
                        reply({
                            code: 500,
                            message: 'Message Not Send',
                            success: false,
                        });
                    }

                }

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
    /*
        deleteNotification    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //delete mosque Board by Board id
                    const deleteData = await MessageModel.remove({_id:request.params._id});

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
        }*/
}