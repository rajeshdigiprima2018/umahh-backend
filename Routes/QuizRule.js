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

const   handlers_quizrule = require('../Handlers/QuizRules').funcs_quizrule;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/quiz/rule/getAll/{quiz_category_id}',
        handler: handlers_quizrule.getQuizRuleByCategryId,
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
        path: '/api/web/quiz/rule/getAll',
        handler: handlers_quizrule.getQuizByCategryIdWeb,
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
        handler: handlers_quizrule.getBoardByMosqueIdWeb,
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
        path: '/api/quiz/rule/get/{_id}',
        handler: handlers_quizrule.getQuizRule,
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
        path: '/api/quiz/rule/add',
        handler: handlers_quizrule.addQuizRule,
        config  :   {
            //auth:   'token',
            description: 'add Quiz Rule.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate: {
                payload :   Joi.object().keys({
                    title        :   Joi.string(),
                    rules :   Joi.string(),
                    quiz_category_id :   Joi.string(),

                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/quiz/rule/modify/{_id}',
        handler: handlers_quizrule.modifyQuizRule,
        config  :   {
            //auth:   'token',
            description: 'Quiz Rule update.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG

            validate: {
                payload :   Joi.object().keys({
                    title        :   Joi.string(),
                    rules :   Joi.string(),
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
        path: '/api/quiz/rule/delete/{_id}',
        handler: handlers_quizrule.deleteQuizRule,
        config  :   {
            //auth:   'token',
            description: 'Quiz Rule delete.',
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
    name: 'routes-quizrule',
    routes  :   arrRoutes
};
