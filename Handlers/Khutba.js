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
let KhutbaModel = require('../Models/khutba').KhutbaModel;

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

module.exports.funcs_khutba = {

    getkhutbaByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque khutba by mosque id

                const getAllData = await KhutbaModel.find({});

                //last time changes remove mosque id
                //const getAllData = await KhutbaModel.find({mosque_id: request.params.mosque_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Mosque khutba all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque khutba not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getkhutbaByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque khutba by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await KhutbaModel.find({mosque_id: request.params.mosque_id}).count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await KhutbaModel.find({mosque_id: request.params.mosque_id})
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    totalCount  :   totCount,
                    message     :   "Mosque khutba all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque khutba not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getkhutba    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque khutba details id
                const getData = await KhutbaModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Mosque khutba list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque khutba not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addkhutba    :   function(request, reply) {

        const aFunc = async function(){
            try {
                let authUser =  helpers_generic.getCurrentAuthUser();

                if(authUser){
                    let docObject = request.payload;
                        docObject.mosque_id =  authUser._id;  
                    //add mosque khutba and mosque id
                    const khutba = new KhutbaModel(docObject);
                    const result = await khutba.save();
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   result,
                        message     :   "Mosque khutba add successfully."
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

    modifykhutba    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque khutba by educaation id

                const modifyData = await KhutbaModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque khutba updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque khutba not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deletekhutba    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque khutba by educaation id
                const deleteData = await KhutbaModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,    
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Mosque khutba deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque khutba not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    }  

}