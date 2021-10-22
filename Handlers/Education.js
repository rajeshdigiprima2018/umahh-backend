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
let EducationModel = require('../Models/education').EducationModel;

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

module.exports.funcs_ed = {

    getEducationByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque education by mosque id

                const getAllData = await EducationModel.find({mosque_id: request.params.mosque_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Mosque education all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque education not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getEducationByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                let authUser =  helpers_generic.getCurrentAuthUser();
                if(authUser.role =='admin'){
                    //get all mosque education by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await EducationModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await EducationModel.find()
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque education all list successfully."
                    }).code(200);
                }
                else
                {

                     //get all mosque education by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await EducationModel.find({mosque_id: request.params.mosque_id}).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await EducationModel.find({mosque_id: request.params.mosque_id})
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque education all list successfully."
                    }).code(200);

                }    

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque education not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getEducation    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque education details id
                const getData = await EducationModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Mosque education list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque education not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addEducation    :   function(request, reply) {

        const aFunc = async function(){
            try {

                //add mosque education and mosque id
                const education = new EducationModel(request.payload);
                const result = await education.save();
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   result,
                    message     :   "Mosque education add successfully."
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

    modifyEducation    :   function(request, reply) {

        const aFunc = async function(){
            console.log('jsagdkagdskAKCKAkAKCAKCkicbbaic');
            try {

                //update mosque education by educaation id
                console.log('jsagdkagdskAKCKAkAKCAKCkicbbaic');

                const modifyData = await EducationModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque education updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque education not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteEducation    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque education by educaation id
                const deleteData = await EducationModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,    
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Mosque education deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque education not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    }  

}