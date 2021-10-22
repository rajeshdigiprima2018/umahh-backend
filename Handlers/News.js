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
var NewsModel = require('../Models/news').NewsModel;
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

module.exports.funcs_news = {

    getNewsByMosqueId: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all mosque News by mosque id

                //const getAllData = await NewsModel.find({ mosque_id: request.params.mosque_id });

                //last time changes remove mosque id
                const getAllData = await NewsModel.find({});
                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    message: "Mosque News all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque News not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getNewsByMosqueIdWeb: function(request, reply) {

        const aFunc = async function() {

            try {

                //get all mosque News by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await NewsModel.find({ mosque_id: request.params.mosque_id }).count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await NewsModel.find({ mosque_id: request.params.mosque_id })
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    totalCount: totCount,
                    message: "Mosque News all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque News not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getNews: function(request, reply) {

        const aFunc = async function() {

            try {

                //get mosque News details id
                const getData = await NewsModel.findById(request.params._id);

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Mosque News list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque News not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addNews: function(request, reply) {

        const aFunc = async function() {
            try {

                /*//add mosque News and mosque id
                const News = new NewsModel(request.payload);
                const result = await News.save();
                return reply({

                success     :   true,
                data        :   result,
                message     :   "Mosque News add successfully."
                }).code(200);*/
                var data = request.payload;


                if (data.image && data.image.size !== 0) {

                    let randomToken = Math.floor(1000 + Math.random() * 9000);
                    var name = data.image.hapi.filename;
                    var newExtension = Path.extname(data.image.hapi.filename);
                    let filename = 'news_dp_' + randomToken + newExtension;
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

                            /* let docObject = request.payload;
                                 docObject.pictures = {
                                     url:result.url
                                 }

                             //add mosque Activities and mosque id
                             const Activities = new ActivitiesModel(docObject);
                             const result = await Activities.save();
                             return reply({

                             success     :   true,
                             data        :   result,
                             message     :   "Mosque Activities add successfully."
                             }).code(200);*/

                            let newObjectAdd = new NewsModel(docObject)

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
                                        message: 'Mosque news added succesfully',
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

    modifyNews: function(request, reply) {

        const aFunc = async function() {

            try {

                //update mosque News by News id

                const modifyData = await NewsModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                return reply({
                    code: 200,
                    success: true,
                    data: modifyData,
                    message: "Mosque News updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque News not updated"
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
                    let filename = 'news_dp_' + randomToken + newExtension;
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

                                const modifyData = await NewsModel.findByIdAndUpdate(request.params._id, docObject, { new: true });

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
    deleteNews: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete mosque News by News id
                const deleteData = await NewsModel.remove({ _id: request.params._id });

                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Mosque News deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque News not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    }
}