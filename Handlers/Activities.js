/**
 * Created by rv2016 on 08/06/17.
 */


"use strict";

var http = require('http');

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
const crypto = require("crypto");
const stripe = require("stripe")("sk_test_lQgpLfteJhFYbcRqpOPvQ6i4");
/*const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const Path = require('path');
const bcrypt     = require('bcryptjs');*/

var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var ActivitiesModel = require('../Models/activities').ActivitiesModel;
var LikeActivityModel = require('../Models/likeactivity').LikeActivityModel;

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


module.exports.funcs_activity = {

    getActivitiesByMosqueId: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all mosque Activities by mosque id

                const getAllData = await ActivitiesModel.find({ mosque_id: request.params.mosque_id });

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    message: "Mosque Activities all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque Activities not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getActivitiesByMosqueIdWeb: function(request, reply) {

        const aFunc = async function() {

            try {
                let authUser = helpers_generic.getCurrentAuthUser();
                if (authUser.role == 'admin') {
                    //get all mosque Activities by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await ActivitiesModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await ActivitiesModel.find()
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();

                    return reply({
                        code: 200,
                        success: true,
                        data: getAllData,
                        totalCount: totCount,
                        message: "Mosque Activities all list successfully."
                    }).code(200);
                } else {
                    //get all mosque Activities by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await ActivitiesModel.find({ mosque_id: request.params.mosque_id }).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await ActivitiesModel.find({ mosque_id: request.params.mosque_id })
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();

                    return reply({
                        code: 200,
                        success: true,
                        data: getAllData,
                        totalCount: totCount,
                        message: "Mosque Activities all list successfully."
                    }).code(200);
                }

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque Activities not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getActivities: function(request, reply) {

        const aFunc = async function() {

            try {

                //get mosque Activities details id
                const getData = await ActivitiesModel.findById(request.params._id);

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Mosque Activities list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque Activities not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addActivities: function(request, reply) {
        const aFunc = async function() {
            try {
                var data = request.payload;
                if (data.image && data.image.size !== 0) {
                    let randomToken = Math.floor(1000 + Math.random() * 9000);

                    var name = data.image.hapi.filename;
                    var newExtension = Path.extname(data.image.hapi.filename);
                    let filename = 'activity_dp_' + randomToken + newExtension;
                    let path = 'Media/Images/CommonImage/' + filename;

                    let deletePath = null;

                    if (data.hasOwnProperty("path") == true) {

                        deletePath = data.path.replace("/public/images/", "./Media/Images/");
                    }

                    helpers_generic.saveImageToPath(data.image, filename, path, '/public/images/CommonImage/', function(err, message, result) {

                        if (result != null) {

                            let docObject = request.payload;
                            docObject.avtar = result.url;
                            docObject.pictures = {
                                url: result.url
                            }

                            let newObjectAdd = new ActivitiesModel(docObject)

                            newObjectAdd.save(function(err, user) {

                                if (err) {

                                    console.error(err);

                                    reply({

                                        success: false,
                                        error: err
                                    });

                                } else {


                                    reply({
                                        code: 200,
                                        message: 'Mosque activity added succesfully',
                                        success: user == null ? false : true,
                                        data: user == null ? {} : user.toObject(),
                                    });

                                    if (data.hasOwnProperty("path") == false) {

                                        return;
                                    }

                                    setTimeout(function() {

                                        helpers_generic.deleteFile(deletePath, function(err) {

                                            if (err) {

                                                console.log('problem deleting file at path' + data.path + '\n Error : ' + err);
                                            } else {

                                                console.log('successfully deleted file at path' + data.path);
                                            }
                                        });

                                    }, 1);
                                }
                            });

                            console.log('Image received and updated successfully.');

                        }


                    });

                } else {
                    reply({
                        success: false,
                        error: 'No Image Data received.'
                    }).code(400);
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

    modifyActivities: function(request, reply) {

        const aFunc = async function() {

            try {

                //update mosque Activities by Activities id

                const modifyData = await ActivitiesModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                return reply({
                    code: 200,
                    success: true,
                    data: modifyData,
                    message: "Mosque Activities updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    code: 500,
                    success: false,
                    message: "Mosque Activities not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    updatePhoto: function(request, reply) {

        const aFunc = async function() {
            try {

                var data = request.payload;


                if (data.image && data.image.size !== 0) {

                    let randomToken = Math.floor(1000 + Math.random() * 9000);
                    var name = data.image.hapi.filename;
                    var newExtension = Path.extname(data.image.hapi.filename);
                    let filename = 'activity_dp_' + randomToken + newExtension;
                    let path = 'Media/Images/CommonImage/' + filename;

                    let deletePath = null;

                    if (data.hasOwnProperty("path") == true) {

                        deletePath = data.path.replace("/public/images/", "./Media/Images/");
                    }

                    helpers_generic.saveImageToPath(data.image, filename, path, '/public/images/CommonImage/', async function(err, message, result) {

                        if (result != null) {

                            let docObject = request.payload;
                            docObject.pictures = {
                                url: result.url
                            }

                            try {

                                //update board photo by _id

                                const modifyData = await ActivitiesModel.findByIdAndUpdate(request.params._id, docObject, { new: true });

                                return reply({
                                    code: 200,
                                    success: true,
                                    data: modifyData,
                                    message: "Activities photo updated successfully."
                                }).code(200);


                                if (data.hasOwnProperty("path") == false) {

                                    return;
                                }

                                setTimeout(function() {

                                    helpers_generic.deleteFile(deletePath, function(err) {

                                        if (err) {

                                            console.log('problem deleting file at path' + data.path + '\n Error : ' + err);
                                        } else {

                                            console.log('successfully deleted file at path' + data.path);
                                        }
                                    });

                                }, 1);

                            } catch (error) {
                                return reply({
                                    success: false,
                                    message: "Activities photo not updated"
                                }).code(500);
                            }

                            console.log('Image received and updated successfully.');

                        }


                    });

                } else {
                    reply({
                        success: false,
                        error: 'No Image Data received.'
                    }).code(400);
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

    deleteActivities: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete mosque Activities by Activities id
                const deleteData = await ActivitiesModel.remove({ _id: request.params._id });

                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Mosque Activities deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque Activities not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    getTodayFeed: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete mosque Activities by Activities id
                const todayData = await ActivitiesModel.find({}).populate('mosque_id', 'avtar username').populate("likeactivity_id", "likeCounter likeUser");;

                return reply({
                    code: 200,
                    success: true,
                    data: todayData,
                    message: "Today feed list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque Activities not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    addLikeActivity: function(request, reply) {

        const aFunc = async function() {
            try {

                const getLikeActivity = await LikeActivityModel.findOne({ activity_id: request.payload.activity_id });

                if (getLikeActivity) {
                    const checkAllreadyExist = await LikeActivityModel.findOne({ $and: [{ activity_id: request.payload.activity_id }, { "likeUser": request.payload.user_id }] });
                    if (checkAllreadyExist) {
                        return reply({
                            code: 200,
                            success: true,
                            data: checkAllreadyExist,
                            message: "Like user allready exist."
                        }).code(200);

                    } else {

                        getLikeActivity.likeCounter = (typeof getLikeActivity.likeCounter != 'undefined') ? getLikeActivity.likeCounter + 1 : 1;

                        getLikeActivity.likeUser.push(request.payload.user_id);
                        const result = await getLikeActivity.save();
                        return reply({
                            code: 200,
                            success: true,
                            data: result,
                            message: "Like add successfully."
                        }).code(200);

                    }

                } else {

                    //add like community and user id
                    let likeAdd = {
                        "activity_id": request.payload.activity_id,
                        "likeUser": request.payload.user_id,
                        "likeCounter": 1
                    }
                    const LikeActivity = new LikeActivityModel(likeAdd);
                    const result = await LikeActivity.save();
                    let addactivity = result.likeactivity_id;
                    const getActivity = await ActivitiesModel.findByIdAndUpdate(request.payload.activity_id, { $set: { likeactivity_id: addactivity } });

                    return reply({
                        code: 200,
                        success: true,
                        data: result,
                        message: "Like add successfully."
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

}