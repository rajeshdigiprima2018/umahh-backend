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

const   handlers_quiz = require('../Handlers/Quiz').funcs_quiz;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/quiz/getAll/{quiz_category_id}',
        handler: handlers_quiz.getQuizByCategryId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Board by mosque id.',
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
        path: '/api/web/quiz/getAll',
        handler: handlers_quiz.getQuizByCategryIdWeb,
        config  :   {
            //auth:   'token',
            description: 'get all Quiz.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    count        :   Joi.number(),
                    page          :   Joi.number()
                }).optional(),
            }
        }
    },
/*    {
        method: 'POST',
        path: '/api/web/Board/getAll/{mosque_id}',
        handler: handlers_quiz.getBoardByMosqueIdWeb,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Board by mosque id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    count        :   Joi.number(),
                    page          :   Joi.number()
                }).optional(),
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }
        }
    },*/

    {
        method: 'GET',
        path: '/api/quiz/get/{_id}',
        handler: handlers_quiz.getQuiz,
        config  :   {
            //auth:   'token',
            description: 'get quiz detail.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/quiz/add',
        handler: handlers_quiz.addQuiz,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Quiz.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate: {
                payload :   Joi.object().keys({
                    question        :   Joi.string(),
                    option1 :   Joi.string(),
                    option2      :   Joi.string(),
                    option3 :   Joi.string(),
                    option4      :   Joi.string(),
                    answer    :   Joi.string(),
                    quiz_category_id :   Joi.string(),

                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/quiz/modify/{_id}',
        handler: handlers_quiz.modifyQuiz,
        config  :   {
            //auth:   'token',
            description: 'Quiz update.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG

            validate: {
                payload :   Joi.object().keys({
                    question        :   Joi.string(),
                    option1 :   Joi.string(),
                    option2      :   Joi.string(),
                    option3 :   Joi.string(),
                    option4      :   Joi.string(),
                    answer    :   Joi.string(),
                    quiz_category_id :   Joi.string(),

                }).optional(),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                }) 
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/quiz/delete/{_id}',
        handler: handlers_quiz.deleteQuiz,
        config  :   {
            //auth:   'token',
            description: 'Quiz delete.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
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
    name: 'routes-quiz',
    routes  :   arrRoutes
};
