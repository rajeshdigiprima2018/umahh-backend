/**
 * Created by rv2016 on 13/12/16.
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
const fetch = require('node-fetch');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var LikeCommunityModel = require('../Models/likecommunity').LikeCommunityModel;
var CommunityModel = require('../Models/community').CommunityModel;
var UserModel = require('../Models/user').UserModel;

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};
var notificationFunction = function(token){
        var notification = {
        'title': 'Umahhh',
        'text': 'One notification'
    };
    // fcm device tokens array
    var fcm_tokens = 'fSnz0Xg4R1KO8iY193IMmW:APA91bFMqABzPnTkSRnizLvQV9c3WEC_YSdl_6xL7epQAkh-L8SyymQG5NKX9e_KP_dW-AEAr5SHXoehXzuD5tGQ3mzSPL9ia2jKEUJ1RHrY_SWi2VXfPqEsE2d6kuPcxdodP5NHKc9Z'
    var notification_body = {
        'notification': notification,
        'to': token  
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
    })
};

module.exports.funcs_likecommunity = {


    getLikeCommunityByUserId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all User LikeCommunity by User id

                const getAllData = await LikeCommunityModel.find({user_id: request.params.user_id}).populate('user_id');
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "User LikeCommunity all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User LikeCommunity not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getLikeCommunity    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get User LikeCommunity details id
                const getData = await LikeCommunityModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "User LikeCommunity list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User LikeCommunity not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    addLikeCommunity    :   function(request, reply) {

        const aFunc = async function(){
            try {

                const getLikeCommunity = await LikeCommunityModel.findOne({community_id: request.payload.community_id});
                const userData = await UserModel.findById({"_id":request.payload.user_id})
                .select('_id, deviceToken');
                if(getLikeCommunity){
                    const checkAllreadyExist = await LikeCommunityModel.findOne({ $and:[ {community_id: request.payload.community_id}, {"likeUser": request.payload.user_id} ]});
                    if(checkAllreadyExist){
                        return reply({
                            code        : 200,
                            success     :   true,
                            data        :   checkAllreadyExist,
                            message     :   "Like user allready exist."
                        }).code(200);

                    }else{
                        getLikeCommunity.likeCounter = (typeof getLikeCommunity.likeCounter != 'undefined') ? getLikeCommunity.likeCounter + 1: 1;
                        console.log("getLikeCommunity",getLikeCommunity);
                        getLikeCommunity.likeUser.push(request.payload.user_id); 
                        const result = await getLikeCommunity.save();

                        if(userData.deviceToken !== null){
                            notificationFunction(userData.deviceToken);
                        }
                        return reply({
                            code :200,
                            success     :   true,
                            data        :   result,
                            message     :   "Like add successfully."
                        }).code(200);

                    }

                }else{
                 
                    //add like community and user id
                    let likeAdd = {
                        "community_id": request.payload.community_id,
                        "likeUser": request.payload.user_id,
                        "likeCounter":1
                    }
                    const LikeCommunity = new LikeCommunityModel(likeAdd);
                    const result = await LikeCommunity.save();
                    let addcommunity = result.likecommunity_id;
                    const getCommunity = await CommunityModel.findByIdAndUpdate(request.payload.community_id, { $set: { likecommunity_id: addcommunity }});
                    if(userData.deviceToken !== null){
                        notificationFunction(userData.deviceToken);
                    }
                    
                    return reply({
                        code :200,
                        success     :   true,
                        data        :   result,
                        message     :   "Like add successfully."
                    }).code(200);

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

    modifyLikeCommunity    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update User LikeCommunity by LikeCommunity id

                const modifyData = await LikeCommunityModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "User LikeCommunity updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User LikeCommunity not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteLikeCommunity    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete User LikeCommunity by LikeCommunity id
                const deleteData = await LikeCommunityModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "User LikeCommunity deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "User LikeCommunity not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    } 
}