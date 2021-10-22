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
var BoardModel = require('../Models/board').BoardModel;
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

module.exports.funcs_Board     =   {

    getBoardByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque Board by mosque id

                const getAllData = await BoardModel.find({mosque_id: request.params.mosque_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Mosque Board all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Board not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getBoardByMosqueIdWeb        :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                let authUser =  helpers_generic.getCurrentAuthUser();
                if(authUser.role =='admin'){

                    //get all mosque Board by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await BoardModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await BoardModel.find()
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Board all list successfully."
                    }).code(200);
                }
                else
                {
                                        //get all mosque Board by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await BoardModel.find({mosque_id: request.params.mosque_id}).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await BoardModel.find({mosque_id: request.params.mosque_id})
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Board all list successfully."
                    }).code(200);

                }    

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Board not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getBoard    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque Board details id
                const getData = await BoardModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Mosque Board list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Board not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addBoard    :   function(request, reply) {

        const aFunc = async function(){
            try {

                /*//add mosque Board and mosque id
                const Board = new BoardModel(request.payload);
                const result = await Board.save();
                return reply({

                success     :   true,
                data        :   result,
                message     :   "Mosque Board add successfully."
                }).code(200);*/
                var data = request.payload;


            if (data.image &&  data.image.size !== 0) {

                let randomToken = Math.floor(1000 + Math.random() * 9000);
                var name = data.image.hapi.filename;
                var newExtension  = Path.extname(data.image.hapi.filename);
                let filename = 'Board_dp_' + randomToken + newExtension;
                let path = 'Media/Images/CommonImage/' + filename;

                let deletePath = null;

                if(data.hasOwnProperty("path") == true){

                    deletePath =   data.path.replace("/public/images/","./Media/Images/");
                }
                
                helpers_generic.saveImageToPath(data.image,filename, path,'/public/images/CommonImage/', function(err,message,result) {

                    if (result != null) {

                        let docObject = request.payload;
                                docObject.pictures = {
                                    url:result.url
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

                            let newObjectAdd = new BoardModel(docObject)

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
                                    success: user == null? false : true,
                                    data: user == null? {} : user.toObject(),
                                    message:'Mosque board added succesfully'
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

    modifyBoard    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque Board by Board id

                const modifyData = await BoardModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque Board updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Board not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  
    updatePhoto     :   function(request, reply) {

        const aFunc = async function(){
            try {

                /*//add mosque Board and mosque id
                const Board = new BoardModel(request.payload);
                const result = await Board.save();
                return reply({

                success     :   true,
                data        :   result,
                message     :   "Mosque Board add successfully."
                }).code(200);*/
                var data = request.payload;


            if (data.image &&  data.image.size !== 0) {

                let randomToken = Math.floor(1000 + Math.random() * 9000);
                var name = data.image.hapi.filename;
                var newExtension  = Path.extname(data.image.hapi.filename);
                let filename = 'Board_dp_' + randomToken + newExtension;
                let path = 'Media/Images/CommonImage/' + filename;

                let deletePath = null;

                if(data.hasOwnProperty("path") == true){

                    deletePath =   data.path.replace("/public/images/","./Media/Images/");
                }
                
                helpers_generic.saveImageToPath(data.image,filename, path,'/public/images/CommonImage/', async function(err,message,result) {

                    if (result != null) {

                        let docObject = request.payload;
                                docObject.pictures = {
                                    url:result.url
                                }

                            try {

                                //update board photo by _id

                                const modifyData = await BoardModel.findByIdAndUpdate(request.params._id, docObject, { new: true });
                                
                                return reply({
                                    code: 200,
                                    success     :   true,
                                    data        :   modifyData,
                                    message     :   "Board photo updated successfully."
                                }).code(200);


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

                            } catch (error) {
                                return reply({
                                    success     :   false,
                                    message     :   "Board photo not updated"
                                }).code(500);
                            }

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
    deleteBoard    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Board by Board id
                const deleteData = await BoardModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Mosque Board deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Board not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    }  
}