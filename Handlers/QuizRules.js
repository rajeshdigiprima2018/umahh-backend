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
var QuizRuleModel = require('../Models/quizRule').QuizRuleModel;
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

module.exports.funcs_quizrule     =   {

    getQuizRuleByCategryId    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque Board by mosque id

                const getAllData = await QuizRuleModel.findOne({"quiz_category_id": request.params.quiz_category_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    message     :   "Quiz all list successfully."
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

   getQuizByCategryIdWeb  :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get all mosque Board by mosque id
                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await QuizRuleModel.find().count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await QuizRuleModel.find()
                    .populate('quiz_category_id')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getAllData,
                    totalCount  :   totCount,
                    message     :   "Quiz rule list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Quiz rule data not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getQuizRule    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //get mosque Board details id
                const getData = await QuizRuleModel.findById(request.params._id);
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getData,
                    message     :   "Get quiz rule details successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "quiz rule details not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addQuizRule    :   function(request, reply) {

        const aFunc = async function(){
            try {

                /*//add mosque Board and mosque id
                const Board = new QuizRuleModel(request.payload);
                const result = await Board.save();
                return reply({

                success     :   true,
                data        :   result,
                message     :   "Mosque Board add successfully."
                }).code(200);*/
                var data = request.payload;
                let authUser =  helpers_generic.getCurrentAuthUser();

               // if(authUser){
                    let docObject = request.payload;           
                    let newObjectAdd = new QuizRuleModel(docObject)

                    let categorySave  = await newObjectAdd.save();
                    if(categorySave){
                        reply({
                            code: 200,
                            message: 'Quiz rule added succesfully',
                            success: true,
                            data: categorySave,
                        });

                    }else{
                        reply({
                            code: 500,
                            message: 'Quiz rule not added',
                            success: false,
                        });
                    }

                //}

            } catch (error) {

                return reply({
                success     :   false,
                message     :   error
                }).code(500);
            }

        };

        execute(aFunc);

    },

    modifyQuizRule    :   function(request, reply) {

        const aFunc = async function(){
            
            try {

                //update mosque Board by Board id

                const modifyData = await QuizRuleModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   modifyData,
                    message     :   "Quiz updated successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Quiz not updated"
                }).code(500);
            }

        };
        execute(aFunc);
    }, 

    deleteQuizRule    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque Board by Board id
                const deleteData = await QuizRuleModel.remove({_id:request.params._id});
                
                return reply({
                    code:200,
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Quiz Rule deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Quiz rule not found"
                }).code(500);
            }

        };
        execute(aFunc);
    }
}