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

let helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
let MerchantModel = require('../Models/merchant').MerchantModel;
let SupplicationModel = require('../Models/supplication').SupplicationModel;
let SuplicationCategoryModel = require('../Models/suplicationCategory').SuplicationCategoryModel;
let SupplicationLikeModel = require('../Models/likesupplication').SupplicationLikeModel;

var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

module.exports.funcs_sp = {

    getAllCategory: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all admin supplication by admin id

                const getAllCategory = await SuplicationCategoryModel.find({});

                return reply({
                    code: 200,
                    success: true,
                    data: getAllCategory,
                    message: "admin all category list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getsupplication: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all admin supplication by admin id

                const getAllSupplication = await SupplicationModel.find({}).populate("supCategory_id").populate("supplicationLike_id", "likeUser likeCounter");

                return reply({
                    code: 200,
                    success: true,
                    data: getAllSupplication,
                    message: "admin supplication all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin supplication not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getsupplicationWeb: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all admin supplication by admin id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await await SupplicationModel.find({}).populate("supCategory_id").populate("supplicationLike_id", "likeUser likeCounter").count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await SupplicationModel.find({}).populate("supCategory_id").populate("supplicationLike_id", "likeUser likeCounter")
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    totalCount: totCount,
                    message: "admin supplication all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin supplication not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getBySupCategory: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all admin supplication by admin id

                const getAllData = await SupplicationModel.find({ supCategory_id: request.payload.supCategory_id }).populate('supplicationLike_id', 'likeUser');

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    message: "admin supplication all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin supplication not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getsupplicationById: function(request, reply) {

        const aFunc = async function() {

            try {

                //get admin supplication details id
                const getData = await SupplicationModel.findById(request.params._id);

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "admin supplication list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin supplication not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addsupplication: function(request, reply) {

        const aFunc = async function() {
            try {

                //add admin supplication and admin id
                const supplication = new SupplicationModel(request.payload);
                const result = await supplication.save();
                return reply({
                    code: 200,
                    success: true,
                    data: result,
                    message: "admin supplication add successfully."
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

    modifysupplication: function(request, reply) {

        const aFunc = async function() {

            try {

                //update admin supplication by educaation id

                const modifyData = await SupplicationModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                return reply({
                    code: 200,
                    success: true,
                    data: modifyData,
                    message: "admin supplication updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin supplication not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },

    deletesupplication: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete admin supplication by educaation id
                const deleteData = await SupplicationModel.remove({ _id: request.params._id });

                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "admin supplication deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin supplication not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },

    addCategory: function(request, reply) {

        const aFunc = async function() {
            try {
                var data = request.payload;


                if (data.image && data.image.size !== 0) {
                    let randomToken = Math.floor(1000 + Math.random() * 9000);

                    var name = data.image.hapi.filename;
                    var newExtension = Path.extname(data.image.hapi.filename);
                    let filename = 'category_dp_' + randomToken + newExtension;
                    let path = 'Media/Images/CommonImage/' + filename;

                    let deletePath = null;

                    if (data.hasOwnProperty("path") == true) {

                        deletePath = data.path.replace("/public/images/", "./Media/Images/");
                    }

                    helpers_generic.saveImageToPath(data.image, filename, path, '/public/images/CommonImage/', function(err, message, result) {

                        if (result != null) {

                            let docObject = request.payload;
                            docObject.iconUrl = result.url;

                            let newObjectAdd = new SuplicationCategoryModel(docObject)

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
                                        message: 'Mosque category added succesfully',
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
    modifyCategory: function(request, reply) {

        var aFunc = function() {

            var data = request.payload;
            // let authUser =  helpers_generic.getCurrentAuthUser();

            if (data.image && data.image.size !== 0) {

                // Gets Authenticated user obtained through Validate fun() on root index.js
                // file via JWT auth validation
                let randomToken = Math.floor(1000 + Math.random() * 9000);

                var name = data.image.hapi.filename;
                var newExtension = Path.extname(data.image.hapi.filename);
                let filename = 'category_dp_' + randomToken + newExtension;
                let path = 'Media/Images/CommonImage/' + filename;

                console.log(name, '\n', filename, '\n', path);

                let deletePath = null;

                if (data.hasOwnProperty("path") == true) {

                    deletePath = data.path.replace("/public/images/", "./Media/Images/");
                }


                helpers_generic.saveImageToPath(data.image, filename, path, '/public/images/CommonImage/', function(err, message, result) {

                    console.log('inside [saveImageToPath] callback function');
                    console.log('message : ' + message);
                    console.log('error : ' + err);

                    console.log('sending Reply to client');

                    if (result != null) {

                        let options = {

                            new: true, // returns new modified object
                            setDefaultsOnInsert: true // sets defaults values on insert

                        };

                        SuplicationCategoryModel.findOneAndUpdate({ _id: request.payload._id }, { "$set": { "name": request.payload.name, "iconUrl": result.url } }, options, function(err, user) {

                            if (err) {

                                console.error(err);

                                reply({

                                    success: false,
                                    error: err
                                });

                            } else {

                                reply({
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

                        ////

                        console.log('Image received and updated successfully.');

                    }


                });
            } else {
                reply({
                    success: false,
                    error: 'No Image Data received.'
                }).code(400);
            }
        };

        execute(aFunc)
    },
    addLikeSupplication: function(request, reply) {

        const aFunc = async function() {
            try {

                const getLikeSupplication = await SupplicationLikeModel.findOne({ supplication_id: request.payload.supplication_id });

                if (getLikeSupplication) {
                    const checkAllreadyExist = await SupplicationLikeModel.findOne({ $and: [{ supplication_id: request.payload.supplication_id }, { "likeUser": request.payload.user_id }] });
                    if (checkAllreadyExist) {
                        checkAllreadyExist.likeUser = checkAllreadyExist.likeUser.filter((user) => {
                            console.log(user, request.payload.user_id);
                            return String(user) !== request.payload.user_id;
                        });
                        checkAllreadyExist.likeCounter = checkAllreadyExist.likeCounter > 0 ? checkAllreadyExist.likeCounter - 1 : checkAllreadyExist.likeCounter;
                        checkAllreadyExist.save();
                        return reply({
                            code: 200,
                            success: true,
                            data: checkAllreadyExist,
                            message: "Like user allready exist."
                        }).code(200);

                    } else {

                        getLikeSupplication.likeCounter = (typeof getLikeSupplication.likeCounter != 'undefined') ? getLikeSupplication.likeCounter + 1 : 1;
                        console.log("getLikeSupplication", getLikeSupplication);
                        getLikeSupplication.likeUser.push(request.payload.user_id);
                        const result = await getLikeSupplication.save();
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
                        "supplication_id": request.payload.supplication_id,
                        "likeUser": request.payload.user_id,
                        "likeCounter": 1
                    }
                    const LikeSupplication = new SupplicationLikeModel(likeAdd);
                    const result = await LikeSupplication.save();
                    let addsupplication = result.supplicationLike_id;
                    const getSupplication = await SupplicationModel.findByIdAndUpdate(request.payload.supplication_id, { $set: { supplicationLike_id: addsupplication } });

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
    getLikeSupplication: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all admin supplication by admin id

                const getAllData = await SupplicationLikeModel.find({ "likeUser": request.payload.user_id }).populate('supplication_id');

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    message: "supplication all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    code: 500,
                    success: false,
                    message: "supplication bookmork list not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

}