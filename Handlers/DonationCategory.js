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

const mongoose = require('mongoose');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var DonationCategoryModel = require('../Models/donationCategory').DonationCategoryModel;
var DonationAmountModel = require('../Models/donationAmount').DonationAmountModel;
var DonationCategoryStatusChangeModel = require('../Models/donationCategoryStatusChange').DonationCategoryStatusChangeModel;
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

module.exports.funcs_dc = {

    getdonationCategory: function(request, reply) {

        const aFunc = async function() {

            try {
                let authUser = helpers_generic.getCurrentAuthUser();

                //get all mosque News by mosque id
                //  if(authUser){
                /*                     const getAllData = await DonationCategoryStatusChangeModel.findOne({"mosque_id":request.params.mosque_id})
                                    let newArray = [];
                                    for (var i = 0; i < getAllData.category.length; i++) {
                                        let newObject = {
                                            "mosque_id": getAllData.mosque_id,
                                            "startDate": getAllData.category[i].startDate,
                                            "endDate": getAllData.category[i].endDate,
                                            "title": getAllData.category[i].title,
                                            "iconUrl": null,
                                            "status": 1,
                                            "createdAt": getAllData.category[i].createdAt,
                                            "deletedAt": null,
                                            "updatedAt": getAllData.category[i].updatedAt,
                                            "dona_category_id": getAllData.category[i]._id,
                                            "id": getAllData.category[i]._id
                                        }
                                        newArray.push(newObject);
                                    } */
                const getAllData = await DonationCategoryModel.find({ "status": 1 });
                let newArray = [];
                for (var i = 0; i < getAllData.length; i++) {
                    let newObject = {
                        "mosque_id": request.params.mosque_id,
                        "startDate": getAllData[i].startDate,
                        "endDate": getAllData[i].endDate,
                        "title": getAllData[i].title,
                        "iconUrl": null,
                        "status": 1,
                        "createdAt": getAllData[i].createdAt,
                        "deletedAt": null,
                        "updatedAt": getAllData[i].updatedAt,
                        "dona_category_id": getAllData[i]._id,
                        "id": getAllData[i]._id
                    }
                    newArray.push(newObject);
                }


                if (getAllData) {
                    return reply({
                        code: 200,
                        success: true,
                        data: newArray,
                        message: "Admin donatoin category list successfully."
                    }).code(200);
                } else {
                    return reply({
                        code: 200,
                        success: true,
                        category: [],
                        message: "Admin donatoin category list successfully."
                    }).code(200);

                }
                // }

            } catch (error) {
                return reply({
                    success: false,
                    message: "Admin donatoin category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getdonationCategoryWeb: function(request, reply) {

        const aFunc = async function() {

            try {
                let authUser = helpers_generic.getCurrentAuthUser();
                if (authUser.role == 'admin') {
                    //get all mosque prayer by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await DonationCategoryModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await DonationCategoryModel.find()
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();

                    return reply({
                        code: 200,
                        success: true,
                        data: getAllData,
                        totalCount: totCount,
                        message: "All category list successfully."
                    }).code(200);

                } else {
                    //get all mosque prayer by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await DonationCategoryStatusChangeModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await DonationCategoryStatusChangeModel.findOne({ "mosque_id": authUser._id })
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    return reply({
                        code: 200,
                        success: true,
                        data: getAllData.category,
                        totalCount: totCount,
                        message: "All category list successfully."
                    }).code(200);

                }

            } catch (error) {
                return reply({
                    success: false,
                    message: "Category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getdonaCategoryById: function(request, reply) {

        const aFunc = async function() {

            try {

                //get donation category details id
                const getCategory = await DonationCategoryModel.findById(request.params._id);

                return reply({
                    code: 200,
                    success: true,
                    data: getCategory,
                    message: "Category details."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    adddonationCategory: function(request, reply) {

        const aFunc = async function() {
            try {
                var data = request.payload;
                let authUser = helpers_generic.getCurrentAuthUser();

                if (authUser) {
                    let docObject = request.payload;
                    let newObjectAdd = new DonationCategoryModel(docObject)

                    let categorySave = await newObjectAdd.save();
                    if (categorySave) {
                        reply({
                            code: 200,
                            message: 'Mosque category added succesfully',
                            success: true,
                            data: categorySave,
                        });

                    } else {
                        reply({
                            code: 500,
                            message: 'Mosque category not added',
                            success: false,
                        });
                    }

                }

                /*            if (data.image &&  data.image.size !== 0 && authUser !=='') {
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
                                            docObject.mosque_id =  authUser._id;

                                            let newObjectAdd = new DonationCategoryModel(docObject)

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
                            }*/

            } catch (error) {

                return reply({
                    code: 500,
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },
    statusUpdateDonationCategory: function(request, reply) {

        const aFunc = async function() {
            try {
                var data = request.payload;
                let authUser = helpers_generic.getCurrentAuthUser();

                if (authUser.role == "admin") {
                    //const mosque_id =  authUser._id;
                    //var o_id =  mongoose.Types.ObjectId(request.payload.dona_category_id);
                    const getUpdateCategory = await DonationCategoryModel.findByIdAndUpdate(request.params._id, data, { new: true })

                    if (getUpdateCategory) {
                        return reply({
                            code: 200,
                            success: true,
                            data: getUpdateCategory,
                            message: "This category deactived successfully."
                        }).code(200);

                    } else {
                        reply({
                            code: 500,
                            message: 'Category not updated',
                            success: false,
                        });
                    }

                }

            } catch (error) {

                return reply({
                    code: 500,
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },

    getDonationAmountById: function(request, reply) {

        const aFunc = async function() {

            try {

                //get mosque prayer details by id
                const getData = await DonationAmountModel.findById(request.params._id);

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Mosque donation amount details."
                }).code(200);

            } catch (error) {
                return reply({
                    code: 500,
                    success: false,
                    message: "Mosque donation not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    modifyDonationAmount: function(request, reply) {

        var aFunc = async function() {

            // var data = request.payload;
            let authUser = helpers_generic.getCurrentAuthUser();

            if (authUser !== '') {

                try {

                    //update mosque prayer by prayer id
                    const amount = {
                        "dona_category_id": request.payload.dona_category_id,
                        "title": request.payload.title,
                        "amount": (Math.round(request.payload.amount * 100) / 100).toFixed(2)
                    }

                    const modifyData = await DonationAmountModel.findByIdAndUpdate(request.params._id, amount, { new: true });

                    return reply({
                        code: 200,
                        success: true,
                        data: modifyData,
                        message: "Mosque donation amount updated successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success: false,
                        message: "Mosque donation amount not updated"
                    }).code(500);
                }

            }
        };

        execute(aFunc)
    },

    deleteDonationCategory: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete mosque News by News id
                const deleteData = await DonationCategoryModel.remove({ _id: request.params._id });

                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Admin donation category deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Admin donation category not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    adddonationAmount: function(request, reply) {

        const aFunc = async function() {
            try {
                const amount = {
                        "dona_category_id": request.payload.dona_category_id,
                        "title": request.payload.title,
                        "amount": (Math.round(request.payload.amount * 100) / 100).toFixed(2),
                        "mosque_id": request.payload.mosque_id
                    }
                    //add mosque donation amount
                const AmountAdd = new DonationAmountModel(amount);
                const result = await AmountAdd.save();
                return reply({
                    code: 200,
                    success: true,
                    data: result,
                    message: "Mosque amount add successfully."
                }).code(200);

            } catch (error) {

                return reply({
                    code: 500,
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },
    deleteDonationAmount: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete mosque donation amount by amount id
                const deleteData = await DonationAmountModel.remove({ _id: request.params._id });

                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Admin donation amount deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    code: 500,
                    success: false,
                    message: "Admin donation amount not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    getdonationAmountList: function(request, reply) {

        const aFunc = async function() {

            try {

                //get mosque News details id
                const getData = await DonationAmountModel.find({ mosque_id: request.params.mosque_id }).populate('dona_category_id');

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Mosque donation amount list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque donation amount not found"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    getAllByCategoryId: function(request, reply) {

        const aFunc = async function() {

            try {

                //get mosque News details id
                const getDatas = await DonationAmountModel.find({ $and: [{ mosque_id: request.payload.mosque_id }, { dona_category_id: request.payload.dona_category_id }] }).populate('dona_category_id');

                return reply({
                    code: 200,
                    success: true,
                    data: getDatas,
                    message: "Mosque donation amount list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "Mosque donation amount not found"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    addUpdateDonationCategory: function(request, reply) {

        const aFunc = async function() {


            try {

                let authUser = helpers_generic.getCurrentAuthUser();

                if (authUser.role == "admin") {
                    //const mosque_id =  authUser._id;
                    //var o_id =  mongoose.Types.ObjectId(request.payload.dona_category_id);
                    const getUpdateCategory = await DonationCategoryModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                    if (getUpdateCategory) {
                        return reply({
                            code: 200,
                            success: true,
                            data: getUpdateCategory,
                            message: "Category updated successfully."
                        }).code(200);

                    } else {
                        reply({
                            code: 500,
                            message: 'Category not updated',
                            success: false,
                        });
                    }

                }

                /*                 var o_id =  mongoose.Types.ObjectId(request.payload.dona_category_id);
                                const getUpdateCategory = await DonationCategoryStatusChangeModel.update({$and:[{"mosque_id":request.payload.mosque_id},{"category._id":o_id}]}, { $set: { "category.$.startDate": request.payload.startDate,"category.$.endDate":request.payload.endDate }});
                                if(getUpdateCategory){
                                    return reply({
                                        code :200,
                                        success     :   true,
                                        data        :   getUpdateCategory,
                                        message     :   "Category updated successfully."
                                    }).code(200);

                                } */

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