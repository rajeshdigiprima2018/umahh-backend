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
let helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
let MerchantModel = require('../Models/merchant').MerchantModel;
let UserModel = require('../Models/user').UserModel;
let FollowingModel = require('../Models/following').FollowingModel;

var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};
var notificationFunction = function(token) {
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
module.exports.funcs_fw = {

    /*    getAllCategory    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get all admin supplication by admin id

                    const getAllCategory = await SuplicationCategoryModel.find({});

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllCategory,
                        message     :   "admin all category list successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "admin category not found"
                    }).code(500);
                }

            };
            execute(aFunc);

        },

        getsupplication    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get all admin supplication by admin id

                    const getAllSupplication = await SupplicationModel.find({}).populate("supCategory_id").populate("supplicationLike_id", "likeUser likeCounter");

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllSupplication,
                        message     :   "admin supplication all list successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "admin supplication not updated"
                    }).code(500);
                }

            };
            execute(aFunc);

        },

        getBySupCategory    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get all admin supplication by admin id

                    const getAllData = await SupplicationModel.find({supCategory_id: request.payload.supCategory_id}).populate('supplicationLike_id','likeUser');

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        message     :   "admin supplication all list successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "admin supplication not updated"
                    }).code(500);
                }

            };
            execute(aFunc);

        },


        getsupplicationById    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get admin supplication details id
                    const getData = await SupplicationModel.findById(request.params._id);

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getData,
                        message     :   "admin supplication list successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "admin supplication not updated"
                    }).code(500);
                }

            };
            execute(aFunc);

        },

        addsupplication    :   function(request, reply) {

            const aFunc = async function(){
                try {

                    //add admin supplication and admin id
                    const supplication = new SupplicationModel(request.payload);
                    const result = await supplication.save();
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   result,
                        message     :   "admin supplication add successfully."
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

        modifysupplication    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //update admin supplication by educaation id

                    const modifyData = await SupplicationModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   modifyData,
                        message     :   "admin supplication updated successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "admin supplication not updated"
                    }).code(500);
                }

            };
            execute(aFunc);
        },

        deletesupplication    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //delete admin supplication by educaation id
                    const deleteData = await SupplicationModel.remove({_id:request.params._id});

                    return reply({
                        code:200,
                        success     :   true,
                        data        :   deleteData,
                        message     :   "admin supplication deleted successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "admin supplication not deleted"
                    }).code(500);
                }

            };
            execute(aFunc);
        },

        addCategory    :   function(request, reply) {

            const aFunc = async function(){
                try {
                var data = request.payload;


                if (data.image &&  data.image.size !== 0) {
                    let randomToken = Math.floor(1000 + Math.random() * 9000);

                    var name = data.image.hapi.filename;
                    var newExtension  = Path.extname(data.image.hapi.filename);
                    let filename = 'category_dp_' + randomToken + newExtension;
                    let path = 'Media/Images/CommonImage/' + filename;

                    let deletePath = null;

                    if(data.hasOwnProperty("path") == true){

                        deletePath =   data.path.replace("/public/images/","./Media/Images/");
                    }

                    helpers_generic.saveImageToPath(data.image,filename, path,'/public/images/CommonImage/', function(err,message,result) {

                        if (result != null) {

                            let docObject = request.payload;
                                docObject.iconUrl =  result.url;

                                let newObjectAdd = new SuplicationCategoryModel(docObject)

                                newObjectAdd.save(function (err, user) {

                                if (err) {

                                    console.error(err);

                                    reply({

                                        success: false,
                                        error: err
                                    });

                                }
                                else {


                                    reply({
                                        code: 200,
                                        message: 'Mosque category added succesfully',
                                        success: user == null? false : true,
                                        data: user == null? {} : user.toObject(),
                                    });

                                    if(data.hasOwnProperty("path") == false){

                                        return;
                                    }

                                    setTimeout(function(){

                                        helpers_generic.deleteFile(deletePath,function(err){

                                            if(err){

                                                console.log('problem deleting file at path' + data.path +'\n Error : ' + err);
                                            }
                                            else{

                                                console.log('successfully deleted file at path' + data.path);
                                            }
                                        });

                                    }, 1);
                                }
                            });

                            console.log('Image received and updated successfully.');

                        }


                    });

                }
                else{
                    reply({
                        success : false,
                        error   : 'No Image Data received.'
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
        modifyCategory  :   function(request, reply){

            var aFunc = function(){

                var data = request.payload;
               // let authUser =  helpers_generic.getCurrentAuthUser();

                if (data.image &&  data.image.size !== 0) {

                     // Gets Authenticated user obtained through Validate fun() on root index.js
                    // file via JWT auth validation
                    let randomToken = Math.floor(1000 + Math.random() * 9000);

                    var name = data.image.hapi.filename;
                    var newExtension  = Path.extname(data.image.hapi.filename);
                    let filename = 'category_dp_' + randomToken + newExtension;
                    let path = 'Media/Images/CommonImage/' + filename;

                    console.log(name,'\n',filename,'\n', path);

                    let deletePath = null;

                    if(data.hasOwnProperty("path") == true){

                        deletePath =   data.path.replace("/public/images/","./Media/Images/");
                    }


                    helpers_generic.saveImageToPath(data.image,filename, path,'/public/images/CommonImage/', function(err,message,result) {

                        console.log('inside [saveImageToPath] callback function');
                        console.log('message : ' + message);
                        console.log('error : ' + err);

                        console.log('sending Reply to client');

                        if (result != null) {

                            let options = {

                                new :    true,                         // returns new modified object
                                setDefaultsOnInsert :   true            // sets defaults values on insert

                            };

                            SuplicationCategoryModel.findOneAndUpdate({_id: request.payload._id}, {"$set":{"name": request.payload.name, "iconUrl": result.url}}, options , function (err, user) {

                                if (err) {

                                    console.error(err);

                                    reply({

                                        success: false,
                                        error: err
                                    });

                                }
                                else {

                                    reply({
                                        success: user == null? false : true,
                                        data: user == null? {} : user.toObject(),
                                    });

                                    if(data.hasOwnProperty("path") == false){

                                        return;
                                    }

                                    setTimeout(function(){

                                        helpers_generic.deleteFile(deletePath,function(err){

                                            if(err){

                                                console.log('problem deleting file at path' + data.path +'\n Error : ' + err);
                                            }
                                            else{

                                                console.log('successfully deleted file at path' + data.path);
                                            }
                                        });

                                    }, 1);
                                }
                            });

                            ////

                            console.log('Image received and updated successfully.');

                        }


                    });
                }
                else{
                    reply({
                        success : false,
                        error   : 'No Image Data received.'
                    }).code(400);
                }
            };

            execute(aFunc)
        },*/
    addFollowing: function(request, reply) {

        const aFunc = async function() {
            try {

                const getFollowing = await FollowingModel.findOne({ mosque_id: request.payload.mosque_id });
                const userData = await UserModel.findById({ "_id": request.payload.mosque_id })
                    .select('_id, deviceToken');
                if (getFollowing) {
                    const checkAllreadyExist = await FollowingModel.findOne({ $and: [{ mosque_id: request.payload.mosque_id }, { "followUser": request.payload.user_id }] });
                    if (checkAllreadyExist) {
                        checkAllreadyExist.followUser = checkAllreadyExist.followUser.filter((user) => {

                            return String(user) !== request.payload.user_id;
                        });
                        checkAllreadyExist.followCounter = checkAllreadyExist.followCounter > 0 ? checkAllreadyExist.followCounter - 1 : checkAllreadyExist.likeCounter;
                        checkAllreadyExist.save();
                        if (userData.deviceToken !== null) {
                            notificationFunction(userData.deviceToken);
                        }
                        return reply({
                            code: 200,
                            success: true,
                            data: checkAllreadyExist,
                            message: "Unfollow mosque"
                        }).code(200);

                    } else {

                        getFollowing.followCounter = (typeof getFollowing.followCounter != 'undefined') ? getFollowing.followCounter + 1 : 1;

                        getFollowing.followUser.push(request.payload.user_id);
                        const result = await getFollowing.save();
                        if (userData.deviceToken !== null) {
                            notificationFunction(userData.deviceToken);
                        }
                        return reply({
                            code: 200,
                            success: true,
                            data: result,
                            message: "Follow add successfully."
                        }).code(200);

                    }

                } else {

                    //add like community and user id
                    let followAdd = {
                        "mosque_id": request.payload.mosque_id,
                        "followUser": request.payload.user_id,
                        "followCounter": 1
                    }
                    const FollowingMosque = new FollowingModel(followAdd);
                    const result = await FollowingMosque.save();
                    let addfollowing = result.following_id;
                    const getMosque = await UserModel.findByIdAndUpdate(request.payload.mosque_id, { $set: { following_id: addfollowing } });
                    if (userData.deviceToken !== null) {
                        notificationFunction(userData.deviceToken);
                    }
                    return reply({
                        code: 200,
                        success: true,
                        data: result,
                        message: "Follow add successfully."
                    }).code(200);

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
    getFollowingList: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all admin supplication by admin id

                const getAllData = await FollowingModel.find({ "followUser": request.payload.user_id }).populate({
                    path: 'mosque_id',
                    select: 'username city state country avtar following_id', // The string we passed in before
                    // populate: {
                    //     path: 'city state country' // This will populate the friends' addresses
                    // }
                });

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    message: "following all mosque list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    code: 500,
                    success: false,
                    message: "following mosque not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

}