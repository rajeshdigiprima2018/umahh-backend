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

const mongoose = require('mongoose');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var QuizCategoryModel = require('../Models/quizCategory').QuizCategoryModel;
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

module.exports.funcs_Quiz     =   {

    getquizCategory    :   function(request, reply) {

        const aFunc = async function(){

            try {
                let authUser =  helpers_generic.getCurrentAuthUser();

                //get all mosque News by mosque id
              //  if(authUser){
                    const getAllData = await QuizCategoryModel.find();
                    console.log('getAllData',getAllData);
                 
                    if(getAllData){
                        return reply({
                            code: 200,
                            success     :   true,
                            data        :   getAllData,
                            message     :   "Quiz category list successfully."
                        }).code(200);
                    }else{
                        return reply({
                            code: 200,
                            success     :   true,
                            data        :   [],
                            message     :   "Quiz category list successfully."
                        }).code(200);

                    }    
               // }

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Quiz category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },


    getquizCategoryById    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                //get mosque category details id
                const getCategory = await QuizCategoryModel.findOne({_id:request.params.quiz_category_id});
                
                return reply({
                    code: 200,
                    success     :   true,
                    data        :   getCategory,
                    message     :   "Category details."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Category not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    addquizCategory    :   function(request, reply) {

        const aFunc = async function(){
            try {
                //console.log('ndbsamdbkbdsd');
            var data = request.payload;
            let authUser =  helpers_generic.getCurrentAuthUser();

            //if(authUser){
                let docObject = request.payload;           
                let newObjectAdd = new QuizCategoryModel(docObject)

                let categorySave  = await newObjectAdd.save();
                if(categorySave){
                    reply({
                        code: 200,
                        message: 'Quiz category added succesfully',
                        success: true,
                        data: categorySave,
                    });

                }else{
                    reply({
                        code: 500,
                        message: 'Quiz category not added',
                        success: false,
                    });
                }

           // }

            } catch (error) {

                return reply({
                    code : 500,
                    success     :   false,
                    message     :   error
                }).code(500);
            }

        };

        execute(aFunc);

    },  

    deleteQuizCategory    :   function(request, reply) {

        const aFunc = async function(){
            
            try {
                
                //delete mosque News by News id
                const deleteData = await QuizCategoryModel.remove({_id:request.params.quiz_category_id});
                
                return reply({
                    code:200,    
                    success     :   true,
                    data        :   deleteData,
                    message     :   "Quiz category deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success     :   false,
                    message     :   "Quiz category not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },
    addUpdateQuizCategory    :   function(request, reply) {

        const aFunc = async function(){
                
                
            try {

                const getUpdateCategory = await QuizCategoryModel.findByIdAndUpdate(request.params.quiz_category_id, request.payload, { new: true });
                if(getUpdateCategory){
                    return reply({
                        code :200,
                        success     :   true,
                        data        :   getUpdateCategory,
                        message     :   "Category updated successfully."
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
}