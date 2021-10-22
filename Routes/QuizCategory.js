/**
 * Created by rv2016 on 22/02/17.
 */

'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const relish = require('relish')({

    stripQuotes:true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});

const appConfig =   require('../ENV').prefs;
const scopes    =   require('../ENV').prefs._SCOPES;


// Local file/Module Imports

const   handlers_generic = require('../Handlers/yummzHandlers').funcs_g;

const   handlers_Quiz = require('../Handlers/QuizCategory').funcs_Quiz;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/quiz/Category/getAll',
        handler: handlers_Quiz.getquizCategory,
        config  :   {
            //auth:   'token',
            description: 'Quiz Category get all',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
/*            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }*/
        }
    },
    {
        method: 'GET',
        path: '/api/quiz/Category/get/{quiz_category_id}',
        handler: handlers_Quiz.getquizCategoryById,
        config  :   {
            //auth:   'token',
            description: 'Quiz Category get details.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   quiz_category_id    :  Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/quiz/Category/add',
        handler: handlers_Quiz.addquizCategory,
        config  :   {
            //auth:   'token',
            description: 'Quiz Category add.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate: {
                payload :   Joi.object().keys({
                    title :   Joi.string(),

                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/quiz/Category/modify/{quiz_category_id}',
        handler: handlers_Quiz.addUpdateQuizCategory,
        config  :   {
            //auth:   'token',
            description: 'Quiz Category update.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
/*            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1 * 1024 * 1024,
                timeout:    110000//12000
            },*/
            validate: {
                payload :   Joi.object().keys({
                    title :   Joi.string(),
                   /* image: Joi.any().meta({ swaggerType: 'file'})
                        .description('Activity Image File')*/

                }).optional(),
                params  :   Joi.object().keys({
                   quiz_category_id    :  Joi.string()
                }) 
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/quiz/Category/delete/{quiz_category_id}',
        handler: handlers_Quiz.deleteQuizCategory,
        config  :   {
            //auth:   'token',
            description: 'Quiz Category delete.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   quiz_category_id    :  Joi.string()
                })
            }
        }
    }

];

exports.register = function(server, options, next) {

    //console.log(
    //    __dirname.split(Path.sep).pop());

    //console.log(__dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/Merchants/'));

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-quizCategry',
    routes  :   arrRoutes
};
