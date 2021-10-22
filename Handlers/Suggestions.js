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

var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var SuggestionsModel = require('../Models/suggestions').SuggestionsModel;

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};


module.exports.funcs_suggestion = {


    getSuggestionsByMosqueId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque Suggestions by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await SuggestionsModel.find({mosque_id: request.params.mosque_id}).count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await SuggestionsModel.find({mosque_id: request.params.mosque_id}).populate('user_id')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    totalCount  :   totCount,
                    message     :   "Mosque Suggestions all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Suggestions not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getSuggestionsByMosqueIdWeb    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                let authUser =  helpers_generic.getCurrentAuthUser();
                if(authUser.role =='admin'){
                    //get all mosque Suggestions by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await SuggestionsModel.find().count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await SuggestionsModel.find().populate('user_id')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Suggestions all list successfully."
                    }).code(200);
                }
                else
                {
                      //get all mosque Suggestions by mosque id
                    let count = request.payload.count ? request.payload.count : 0;
                    let skip = request.payload.count * (request.payload.page - 1);
                    let sorting = { createdAt: -1 };
                    let totCount;
                    const getCount = await SuggestionsModel.find({mosque_id: request.params.mosque_id}).count();
                    totCount = getCount;
                    if (!request.payload.count) {
                        count = totCount;
                    }

                    const getAllData = await SuggestionsModel.find({mosque_id: request.params.mosque_id}).populate('user_id')
                        .limit(parseInt(count))
                        .skip(parseInt(skip))
                        .sort(sorting)
                        .lean();
                    
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        totalCount  :   totCount,
                        message     :   "Mosque Suggestions all list successfully."
                    }).code(200);

                }    

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Suggestions not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    getSuggestions    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque Suggestions details id
                const getData = await SuggestionsModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Mosque Suggestions list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Suggestions not updated"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addSuggestions    :   function(request, reply) {

        const aFunc = async function(){
            try {

                //add mosque Suggestions and mosque id
                const Suggestions = new SuggestionsModel(request.payload);
                const result = await Suggestions.save();
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   result,
                    message     :   "Mosque Suggestions add successfully."
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

    modifySuggestions    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque Suggestions by Suggestions id

                const modifyData = await SuggestionsModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Mosque Suggestions updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Suggestions not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    },  

    deleteSuggestions    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Suggestions by Suggestions id
                const deleteData = await SuggestionsModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Mosque Suggestions deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Mosque Suggestions not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    } 
}