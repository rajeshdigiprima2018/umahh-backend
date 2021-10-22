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

    stripQuotes: true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});

const appConfig = require('../ENV').prefs;
const scopes = require('../ENV').prefs._SCOPES;


// Local file/Module Imports

const handlers_generic = require('../Handlers/yummzHandlers').funcs_g;

const handlers_dc = require('../Handlers/DonationCategory').funcs_dc;

const baseResponse = require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/donation/category/getAll/{mosque_id}',
        handler: handlers_dc.getdonationCategory,
        config: {
            // auth:   'token',
            description: 'Admin get all donation category.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    mosque_id: Joi.string()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/web/donation/category/getAll',
        handler: handlers_dc.getdonationCategoryWeb,
        config: {
            auth: 'token',
            description: 'Admin get all donation category.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({
                    count: Joi.number(),
                    page: Joi.number()
                }).optional()
            }
        }
    },

    {
        method: 'GET',
        path: '/api/donation/category/get/{_id}',
        handler: handlers_dc.getdonaCategoryById,
        config: {
            //auth:   'token',
            description: 'Mosque get getdonaCategoryById.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string(),
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/donation/category/add',
        handler: handlers_dc.adddonationCategory,
        config: {
            auth: 'token',
            description: 'Admin add donation category.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            /*  plugins: {
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
                payload: Joi.object().keys({

                    startDate: Joi.string(),
                    endDate: Joi.string(),
                    title: Joi.string(),
                    /*image: Joi.any().meta({ swaggerType: 'file'})
                        .description('donation Image File')*/

                }).optional()
            }
        }
    },
    {
        method: 'POST',
        path: '/api/donation/category/update/{_id}',
        handler: handlers_dc.addUpdateDonationCategory,
        config: {
            auth: 'token',
            description: 'Mosque update donation category.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                payload: Joi.object().keys({
                    title: Joi.string(),
                }).optional(),
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/donation/category/statusupdate/{_id}',
        handler: handlers_dc.statusUpdateDonationCategory,
        config: {
            auth: 'token',
            description: 'Mosque update donation category status.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                payload: Joi.object().keys({
                    status: Joi.string(),

                }).required(),
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/donation/amount/get/{_id}',
        handler: handlers_dc.getDonationAmountById,
        config: {
            //auth:   'token',
            description: 'Mosque get donation amount.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/donation/modifyDonationAmount/{_id}',
        handler: handlers_dc.modifyDonationAmount,
        config: {
            auth: 'token',
            description: 'admin donation  amount modify.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'admin'], // ADD THIS TAG
            validate: {
                payload: Joi.object().keys({
                    dona_category_id: Joi.string(),
                    title: Joi.string(),
                    amount: Joi.string(),

                }).required(),
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },

    {
        method: 'DELETE',
        path: '/api/donation/category/delete/{_id}',
        handler: handlers_dc.deleteDonationCategory,
        config: {
            //auth:   'token',
            description: 'Admin delete donation category.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },
    //set donation amount by mosque api
    {
        method: 'POST',
        path: '/api/donation/setAmount/add',
        handler: handlers_dc.adddonationAmount,
        config: {
            //auth:   'token',
            description: 'Mosque add donation Amount.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                payload: Joi.object().keys({
                    dona_category_id: Joi.string(),
                    title: Joi.string(),
                    amount: Joi.string(),
                    mosque_id: Joi.string()

                }).optional()
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/donation/setAmount/delete/{_id}',
        handler: handlers_dc.deleteDonationAmount,
        config: {
            //auth:   'token',
            description: 'Mosque delete donation amount.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/donation/setAmount/getAll/{mosque_id}',
        handler: handlers_dc.getdonationAmountList,
        config: {
            //auth:   'token',
            description: 'Mosque get donationAmount.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    mosque_id: Joi.string()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/donation/setAmount/getAllByCategoryId',
        handler: handlers_dc.getAllByCategoryId,
        config: {
            //auth:   'token',
            description: 'Mosque get donationAmount.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                payload: Joi.object().keys({
                    dona_category_id: Joi.string(),
                    mosque_id: Joi.string()

                }).optional()
            }
        }
    },

];

exports.register = function(server, options, next) {

    //console.log(
    //    __dirname.split(Path.sep).pop());

    //console.log(__dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/Merchants/'));

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-donationCategory',
    routes: arrRoutes
};