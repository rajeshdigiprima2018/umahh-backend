/**
 * Created by rv2016 on 19/01/17.
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


// Local file/Module Imports

const  FoodChoices  = require('../Models/commondata').foodChoicesModel;

const handlers_cd = require('../Handlers/CommonData').funcs_cd;

const baseResponse  =   require('./Responses');

const appConfig = require('../ENV').prefs;



var checkval = function(req, reply){

    if (req.params.scope.toLocaleLowerCase() == 'user'){

        console.log('user scope identified. needs auth')

        // access Config of route by calling route.settings

        req.route.settings.auth = 'token'
    }

        return reply.continue();
}


var arrRoutes = []/*[
    {
        method  :   'GET',
        path    :   '/api/foodchoices/{scope}',
        handler :   handlers_cd.getFoodChoices,
        config  :   {
            //auth : 'false',
            description: 'gets a whole set of Food Choices Data.',
            notes: 'Returns complete set of User Choices (including deleted ones)stored in System.Here Client apps will manage the choices',
            tags: ['api','sa','admin','mobile'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params : Joi.object().keys({
                    scope : Joi.string().valid('admin','user','Admin','ADMIN','User','user').required()
                })
            }

        }
    },


    {
        method  :   'DELETE',
        path    :   '/api/foodchoices/{data_id}',
        handler :   handlers_cd.deleteFoodChoices,
        config  :   {
            //auth : 'false',
            description: 'Removes specified Food Choices Data.',
            notes: 'Returns deleted set of Food Choices recently removed from System',
            tags: ['api','sa','admin'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params : Joi.object().keys({
                    data_id : baseResponse.commonSchemas.mongooseID.required()
                }).required()
            }
        }
    },

    {
        method  :   'DELETE',
        path    :   '/api/foodchoices',
        handler :   handlers_cd.deleteFoodChoices,
        config  :   {
            //auth : 'false',
            description: 'Removes all Food Choices Data from System.',
            notes: 'Returns deleted set of Food Choices data recently removed from System',
            tags: ['api','sa'], // ADD THIS TAG

        }
    },


    {
        method:'POST',
        path:'/api/foodchoices/insert',
        handler:handlers_cd.insertNewFoodChoices,
        config: {
            //auth : 'false',
            description: 'Creates a whole new Food Choices Collection or inserts items into existing collection.',
            notes: 'This API facilitates creation of new FoodChoices Collection and addition of new items to existing collection. This collection is unique, only one -whole system wide. \n' +
            '\n This API returns newly inserted food choice items as array named \'newItems\'.\n'+
            //'\n But this \'data_id\' field is not compulsory when only \'insert\' array is supplied in payload.\n'+
            '\n The other field named \'item_id\' is the one which is associated with each item in the Food Choices List',
            tags: ['api','admin','sa'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction,
                payload:  Joi.object().keys({
                    //data_id :   Joi.string().alphanum().min(10).max(32),
                    insert  :     Joi.array().min(1).unique().max(100).items(
                        Joi.string().min(5).max(100).required()
                        //Joi.object().keys({
                        //    name    :   Joi.string().min(5).max(100).required(),
                        //    deleted  :   Joi.boolean().default(false)
                        //})
                    ),
                    
                   // delete  :     Joi.array().items(
                   //     Joi.string().alphanum().min(10).max(32)
                        //Joi.object().keys({
                        //    item_id      :   Joi.string().alphanum().min(10).max(32),
                        //})
                   // ),
                    //modify  :     Joi.array().items(
                   //     Joi.object().keys({
                   //         item_id      :   Joi.string().alphanum().min(10).max(32),
                   //         name  :  Joi.string().min(5).max(100).required()
                   //     })
                    )
               // }).or('insert','data_id')//.with('delete','data_id').with('modify','data_id')


                //    insert  :     Joi.array().items(Joi.string())
                //
                //})


            }
        }
    },

    {
        method:'POST',
        path:'/api/foodchoices/modify',
        handler:handlers_cd.modifyFoodChoices,
        config: {
            //auth : 'false',
            description: 'Updates existing food choice items in collection by updating its name and availability .',
            notes: 'This API facilitates changing \'name\' and/or \'deleted\' field of existing food choices item.\n'+
                '\nwhen a \'deleted\' field is set to \'true\' then that item/s will be deleted from the collection.',
            tags: ['api','admin','sa'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction,
                payload:  Joi.object().keys({
                    data_id :   Joi.string().alphanum().min(10).max(32).required(),

                     modify  :     Joi.array().min(1).unique().items(
                        Joi.object().keys({
                            item_id    :   Joi.string().alphanum().min(10).max(32),
                            name       :  Joi.string().min(5).max(100).required(),
                            deleted    :   Joi.boolean().default(false)
                        })
                     ).required()
                }).required()

            }
        }
    },
    {
        method  :   'GET',
        path    :   '/api/status/user/session',
        handler :   handlers_cd.getUserSessionStatus,
        config  :   {
            description: 'Checks Session validity for user',
            notes: 'This API will help to check your access token is valid or not',
            auth :  {strategy   :   'token', scope : [ appConfig._SCOPES.CONSUMER]},
            tags: ['api','admin','sa'], // ADD THIS TAG

        }
    },

];*/



exports.register = function(server, options, next) {

    const db = server.app.db;

    console.log('Commondata registered....')

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name    :   'routes-commondata',
    routes  :   arrRoutes
};

