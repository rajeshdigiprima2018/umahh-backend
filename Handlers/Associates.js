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
var AssociatesModel = require('../Models/associates').AssociatesModel;
var AdminModel = require('../Models/admin').AdminModel;
var UserModel = require('../Models/user').UserModel;
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

module.exports.funcs_associates     =   {

    getAssociatesByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque Associates by mosque id

                const getAllData = await AssociatesModel.findOne({mosque_id: request.params.mosque_id}).populate('associate_user');
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Mosque Associates all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Associates not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getAssociatesByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque Associates by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await AssociatesModel.findOne({mosque_id: request.params.mosque_id});
                if(getCount){
                    totCount = getCount.associate_user.length;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await AssociatesModel.findOne({mosque_id: request.params.mosque_id}).populate('associate_user')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code:200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Associates all list successfully."
                    }).code(200);
                }else{
                    return reply({
                        code:200,
                        success     :   true,
                        data        :   [],
                        totalCount  :   0,
                        message     :   "Mosque Associates not found."
                    }).code(200);    

                }    

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Associates not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getAssociates    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque Associates details id
                const getData = await AssociatesModel.findById(request.params._id);
                
                return reply({

                success     :   true,
                data        :   getData,
                message     :   "Mosque Associates list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Associates not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addAssociates    :   function(request, reply) {

        const aFunc = async function(){
            try {

                const getData = await AssociatesModel.findOne({mosque_id: request.payload.mosque_id});

                if(getData){
                    const checkAllreadyExist = await AssociatesModel.findOne({ $and:[ {mosque_id: request.payload.mosque_id}, {"associate_user": request.payload.associate_user} ]});
                    if(checkAllreadyExist){
                        checkAllreadyExist.associate_user = checkAllreadyExist.associate_user.filter((user) => {
                            console.log(user, request.payload.associate_user);
                            return String(user) !== request.payload.associate_user; 
                        });
                     
                        checkAllreadyExist.save();

                        return reply({
                            code        : 200,
                            success     :   true,
                            data        :   checkAllreadyExist,
                            message     :   "Mosque Associates allready exist."
                        }).code(200);

                    }else{

                        getData.associate_user.push(request.payload.associate_user); 
                        const result = await getData.save();
                        return reply({
                            code :200,
                            success     :   true,
                            data        :   result,
                            message     :   "Mosque Associates add successfully."
                        }).code(200);

                    }

                }else{
                    //add mosque Associates and mosque id
   
                    let associateAdd = {
                        "mosque_id": request.payload.mosque_id,
                        "associate_user": request.payload.associate_user
                    }
  
                    const Associates = new AssociatesModel(associateAdd);
                    const result = await Associates.save();
                    let addassociates = result.associates_id;
                    const getAssocites = await UserModel.findByIdAndUpdate(request.payload.mosque_id, { $set: { associates_id: addassociates }});

                    return reply({
                        code :200,
                        success     :   true,
                        data        :   result,
                        message     :   "Associates add successfully."
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
/*        addLikeSupplication    :   function(request, reply) {

        const aFunc = async function(){
            try {

                const getLikeSupplication = await SupplicationLikeModel.findOne({supplication_id: request.payload.supplication_id});
                
                if(getLikeSupplication){
                    const checkAllreadyExist = await SupplicationLikeModel.findOne({ $and:[ {supplication_id: request.payload.supplication_id}, {"likeUser": request.payload.user_id} ]});
                    if(checkAllreadyExist){
                        checkAllreadyExist.likeUser = checkAllreadyExist.likeUser.filter((user) => {
                            console.log(user, request.payload.user_id);
                            return String(user) !== request.payload.user_id; 
                        });
                        checkAllreadyExist.likeCounter = checkAllreadyExist.likeCounter > 0 ? checkAllreadyExist.likeCounter - 1 : checkAllreadyExist.likeCounter;
                        checkAllreadyExist.save();
                        return reply({
                            code        : 200,
                            success     :   true,
                            data        :   checkAllreadyExist,
                            message     :   "Like user allready exist."
                        }).code(200);

                    }else{

                        getLikeSupplication.likeCounter = (typeof getLikeSupplication.likeCounter != 'undefined') ? getLikeSupplication.likeCounter + 1: 1;
                        console.log("getLikeSupplication",getLikeSupplication);
                        getLikeSupplication.likeUser.push(request.payload.user_id); 
                        const result = await getLikeSupplication.save();
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
                        "supplication_id": request.payload.supplication_id,
                        "likeUser": request.payload.user_id,
                        "likeCounter":1
                    }
                    const LikeSupplication = new SupplicationLikeModel(likeAdd);
                    const result = await LikeSupplication.save();
                    let addsupplication = result.supplicationLike_id;
                    const getSupplication = await SupplicationModel.findByIdAndUpdate(request.payload.supplication_id, { $set: { supplicationLike_id: addsupplication }});

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

    },*/

    modifyAssociates    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque Associates by Associates id

                const modifyData = await AssociatesModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({

                success     :   true,
                data        :   modifyData,
                message     :   "Mosque Associates updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Associates not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteAssociates    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Associates by Associates id
                const getData = await AssociatesModel.findOne({mosque_id: request.payload.mosque_id});
                console.log('hhhhhhhhh',getData);
                if(getData){
                    getData.associate_user = getData.associate_user.filter(associate_id => associate_id != request.payload.associate_id)
                    getData.save()
                    
                    return reply({
                        code        : 200,
                        success     :   true,
                        data        :   getData,
                        message     :   "Mosque Associates deleted successfully."
                    }).code(200);
                }else{

                    
                }    

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Associates not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    }  
}