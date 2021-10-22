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

const   handlers_Board = require('../Handlers/Board').funcs_Board;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/Board/getAll/{mosque_id}',
        handler: handlers_Board.getBoardByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Board by mosque id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/web/Board/getAll/{mosque_id}',
        handler: handlers_Board.getBoardByMosqueIdWeb,
        config  :   {
            auth:   'token',
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
    },

    {
        method: 'GET',
        path: '/api/mosque/Board/get/{_id}',
        handler: handlers_Board.getBoard,
        config  :   {
            //auth:   'token',
            description: 'Mosque get Board.',
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
        path: '/api/mosque/Board/add',
        handler: handlers_Board.addBoard,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Board.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            plugins: {
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
            },
            validate: {
                payload :   Joi.object().keys({
                    name        :   Joi.string(),
                    title :   Joi.string(),
                    textarea      :   Joi.string(),
                    mosque_id :   Joi.string(),
                    image: Joi.any().meta({ swaggerType: 'file'})
                        .description('Activity Image File')

                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/Board/modify/{_id}',
        handler: handlers_Board.modifyBoard,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Board.',
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
                    name        :   Joi.string(),
                    title :   Joi.string(),
                    textarea      :   Joi.string()
                   /* image: Joi.any().meta({ swaggerType: 'file'})
                        .description('Activity Image File')*/

                }).optional(),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                }) 
            }
        }
    },
    {
        method: 'POST',
        path: '/api/mosque/Board/updatePhoto/{_id}',
        handler: handlers_Board.updatePhoto,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Board update photo.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            plugins: {
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
            },
            validate: {
                payload :   Joi.object().keys({
                    image: Joi.any().meta({ swaggerType: 'file'})
                        .description('board Image File')

                }).optional(),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                }) 
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/mosque/Board/delete/{_id}',
        handler: handlers_Board.deleteBoard,
        config  :   {
            //auth:   'token',
            description: 'Mosque delete Board.',
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
    name: 'routes-board',
    routes  :   arrRoutes
};
