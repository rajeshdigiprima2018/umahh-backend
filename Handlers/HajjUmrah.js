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
const bcrypt     = require('bcryptjs');
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

var helpers_generic =  require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var HajjUmrahModel = require('../Models/hajjAndUmrah').HajjUmrahModel;
var HajjUmrahCategoryModel = require('../Models/hajjAndUmrahCategory').HajjUmrahCategoryModel;

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


module.exports.funcs_hu = {

    getAll    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all admin hajj and umrah by admin id

                const getHajjandumrah = await HajjUmrahModel.find({}).populate("hajjumrahCategory_id");
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getHajjandumrah,
                    message     :   "admin all umrah and hajj list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "admin umrah and hajj category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getAllWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all admin hajj and umrah by admin id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await await HajjUmrahModel.find({}).populate("hajjumrahCategory_id").count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await await HajjUmrahModel.find({}).populate("hajjumrahCategory_id")
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    totalCount  :   totCount,
                    message     :   "admin all umrah and hajj list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "admin umrah and hajj category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getAllCategoryUmrah    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all admin hajj and umrah by admin id

                const getCategoryUmrah = await HajjUmrahCategoryModel.find({});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getCategoryUmrah,
                    message     :   "admin all umrah and hajj category list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "admin umrah and hajj category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getByhajUmCategory    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all admin hajj and umrah by admin id

                const getAllHajjUmrah = await HajjUmrahModel.find({hajjumrahCategory_id: request.payload.hajjumrahCategory_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllHajjUmrah,
                    message     :   "hajj and umrah all successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "admin hajj and umrah not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    gethajjumrahById    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get admin hajj and umrah details id
                const getDetail = await HajjUmrahModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getDetail,
                    message     :   "hajj and umrah list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "hajj and umrah not found"
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


                var name = data.image.hapi.filename;
                var newExtension  = Path.extname(data.image.hapi.filename);
                let filename = 'hajj_dp_' + data.name + newExtension;
                let path = 'Media/Images/CommonImage/' + filename;

                let deletePath = null;

                if(data.hasOwnProperty("path") == true){

                    deletePath =   data.path.replace("/public/images/","./Media/Images/");
                }
                
                helpers_generic.saveImageToPath(data.image,filename, path,'/public/images/CommonImage/', function(err,message,result) {

                    if (result != null) {

                        let docObject = request.payload;
                            docObject.imageUrl = result.url;

                            let newObjectAdd = new HajjUmrahCategoryModel(docObject)

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
                                    message: 'Category added succesfully',
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
    addHajjUmrah    :   function(request, reply) {

        const aFunc = async function(){
            try {

                //add admin supplication and admin id
                const hajjumrah = new HajjUmrahModel(request.payload);
                const result = await hajjumrah.save();
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   result,
                    message     :   "add successfully."
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

    modifyHajjAndUmrah    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque hajj umrah by _id

                const modifyData = await HajjUmrahModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code        : 200,    
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque hajj umrah updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    code        : 500,
                    success     :   false,
                    message     :   "Mosque hajj and umrah not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteHajjUmrah    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Activities by Activities id
                const deleteData = await HajjUmrahModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,    
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Admin hajj and umrah deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Admin hajj and umrah not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },
  /*  getTodayFeed  :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Activities by Activities id
                const todayData = await ActivitiesModel.find({}).populate('mosque_id', 'avtar username');
                
                return reply({
                    code:200,    
                    success     :   true,
                    data        :   todayData,
                    message     :   "Today feed list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Activities not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },*/

}