/**
 * Created by rv2016 on 10/02/17.
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


const commonErrors      =   require('./Common');


let anExmaple1  =   {
    
                    "fromEmail": 'demo1@gmail.com',
                    "toEmail": "demo2@gmail.com",
                }


let error500    =   {

    statusCode  :   Joi.number().min(200).max(500),
    message     :   Joi.string(),
    error       :   Joi.string()
}


let error400    =   {

    statusCode  :   Joi.number().min(200).max(500),
    message     :   Joi.string(),
    error       :   Joi.string(),
    success     :   Joi.boolean().default(false),
    message_readable    :   Joi.string(),
    validation  :   Joi.object()
}

module.exports  =   {

        inviteAddNew     :    {

        '200'   :   Joi.object().keys({
            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Invite Data Created successfully'),
            data        :   Joi.any().example(anExmaple1)
        }),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    },

    getDetails  :   {

        '200'   :   Joi.object().keys({

            success     :   Joi.boolean().example(true),
            message     :   Joi.string().optional().example('Get details retrieved successfully.'),
            data        :   Joi.object().keys({

                user_id     :   Joi.any().optional(),
                username:       Joi.string().optional(),
                nameContactPerson : Joi.string().optional(),
                first_name:         Joi.string().optional(),
                last_name:          Joi.string().optional(), 
                email:              Joi.string().optional(), 
                role:               Joi.string().optional(), 
                mobile:             Joi.any().optional(), 
                isFBUser   :        Joi.boolean().optional(), 
                dob        :        Joi.any().optional(), 
                avtar      :        Joi.string().optional(),
                deviceToken :       Joi.string().optional(),
                location   :        Joi.any().optional(),  
                street_address :    Joi.string().optional(),
                country        :    Joi.string().optional(),
                state          :    Joi.string().optional(),
                city           :    Joi.string().optional(),
                zipCode        :    Joi.string().optional(),
                verifyType     :    Joi.boolean().optional(),
                sessions       :    Joi.string().optional(),
                createdAt      :    Joi.string().optional(),
                deletedAt      :    Joi.string().optional(),
                updatedAt      :    Joi.string().optional(),
            })

        }).optional(),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    }
}