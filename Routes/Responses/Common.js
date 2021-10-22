/**
 * Created by rv2016 on 07/02/17.
 */

'use strict'

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const jwt = require('hapi-auth-jwt2');

const relish = require('relish')({

    stripQuotes:true,
    messages    :{
        email   :   'Please provide valid email address.'

    }
});


module.exports = {

    error500    :
        Joi.object().keys({
            statusCode  :   Joi.number().example(500),
            message     :   Joi.string(),
            error       :   Joi.string()
        }),

    error400    :
        Joi.object().keys({
            statusCode  :   Joi.number().example(400),
            message     :   Joi.string(),
            error       :   Joi.string(),
            success     :   Joi.boolean().default(false),
            message_readable    :   Joi.string(),
            validation  :   Joi.object()
        }).description('Bad Request OR validation Error'),

    error404    :
        Joi.object().keys({
            success     :   Joi.boolean().default(false),
            message     :   Joi.string(),
            error       :   Joi.any()
        }).description('Not Found OR Any other BL Error'),
}