/**
 * Created by rv2016 on 02/11/16.
 */


'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const Path = require('path');
const relish = require('relish')({

    stripQuotes: true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});
const scopes = require('../ENV').prefs._SCOPES;
let baseResponses = require('./Responses');
let commonValidations = baseResponses.commonSchemas;
let responseByCodes = baseResponses.users;
const appConfig = require('../ENV').prefs;

// Local file/Module Imports
const User = require('../Models/user.js');
const handlers_pay = require('../Handlers/PaypalPayment').funcs_pay;

const handlers_cd = require('../Handlers/CommonData').funcs_cd;
const funcs_smsend = require('../Handlers/SMS').funcs_sms;



const serverExports = null; //require('../server');

var shouldPrefix = false;
var pathPrefix = '';

if (serverExports) {

    if (serverExports.prefix != undefined && serverExports.prefix != null && serverExports.prefix.length > 0) {
        shouldPrefix = true;
        pathPrefix = serverExports.prefix;
    } else {
        shouldPrefix = false;
        pathPrefix = '';
    }

}

console.log('common file path :', shouldPrefix == true ? pathPrefix + 'Media/Images/Merchants' : 'Media/Images/Merchants' + '--xxxxxxx');



var arrRoutes = [

    {
        method: 'POST',
        path: '/api/payment',
        handler: handlers_pay.addPayment,
        config: {
            auth: 'token',
            description: 'paypal send payment',
            notes: 'Returns paypal send data or error.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            /*validate: {
               // failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys(
                {

                    first_name      :   Joi.string().trim().min(3).max(20),
                    last_name       :   Joi.string().trim().min(3).max(20),
                    nameContactPerson:   Joi.string(),
                    mobile          :    Joi.string().allow(['+','-']).required(),
                    email           :    Joi.string().required(),
                    street_address  :    Joi.string(),
                    country         :    Joi.string(),
                    state           :    Joi.string(),

                    city            :    Joi.string(),
                    zipCode         :    Joi.string(),
                    lat             :   Joi.number(),
                    lng             :   Joi.number(),
                })

            }*/
        }
    },

    {
        method: 'GET',
        path: '/api/payment/success',
        handler: handlers_pay.getPayment,
        config: {
            //auth : 'token',
            description: 'paypal get response payment',
            notes: 'Returns paypal get response or error.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            /*validate: {
               // failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys(
                {

                    first_name      :   Joi.string().trim().min(3).max(20),
                    last_name       :   Joi.string().trim().min(3).max(20),
                    nameContactPerson:   Joi.string(),
                    mobile          :    Joi.string().allow(['+','-']).required(),
                    email           :    Joi.string().required(),
                    street_address  :    Joi.string(),
                    country         :    Joi.string(),
                    state           :    Joi.string(),

                    city            :    Joi.string(),
                    zipCode         :    Joi.string(),
                    lat             :   Joi.number(),
                    lng             :   Joi.number(),
                })

            }*/
        }
    },
    {
        method: 'POST',
        path: '/api/payment/savePayment',
        handler: handlers_pay.savePayment,
        config: {
            auth: 'token',
            description: 'payment add database',
            notes: 'Returns paypal send data or error.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                // failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    mosque_id: Joi.string().required(),
                    txn_id: Joi.string().required(),
                    amount: Joi.number().required()
                })

            }
        }
    },
    {
        method: 'POST',
        path: '/api/payment/getPaymentByMosque',
        handler: handlers_pay.getPaymentByMosque,
        config: {
            auth: 'token',
            description: 'payment get by mosque',
            notes: 'Returns paypal send data or error.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                // failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    count: Joi.number(),
                    page: Joi.number()
                }).optional(),

            }
        }
    },
    {
        method: 'GET',
        path: '/api/payment/getPaymentByUser',
        handler: handlers_pay.getPaymentByUser,
        config: {
            auth: 'token',
            description: 'payment get by user',
            notes: 'Returns paypal send data or error.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            /*             validate: {
                           // failAction  :   relish.failAction, // For customized and readable JOI Error Message
                            payload :   Joi.object().keys({
                                count        :   Joi.number(),
                                page          :   Joi.number()
                            }).optional(),

                        } */
        }
    },


];


//  Routes and handlers




exports.register = function(server, options, next) {

    const db = server.app.db;

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name: 'routes-payment',
    routes: arrRoutes
};