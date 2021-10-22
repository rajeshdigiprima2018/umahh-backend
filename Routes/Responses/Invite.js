/**
 * Created by rv2016 on 03/02/17.
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
    "user_id": "587489bee272bc047195eefb",

    "inviteUser": [
                {
                    "from": 'demo1@gmail.com',
                    "to": "demo2@gmail.com",
                }
            ]
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

    //addNewHTTPStatusCodes   :{
    //
    //    '200'   :   {
    //        "success": true,
    //        "data": {
    //            "merchant_id": "587489bee272bc047195eefb",
    //            "menuData": {
    //                "_id": "589430d6097e710409b8e454",
    //                "images_menucards": {
    //                    "paths": [],
    //                    "curr_index": -1
    //                },
    //                "categories": [
    //                    {
    //                        "categoryName": "New category",
    //                        "_id": "589430d6097e710409b8e455",
    //                        "items": [
    //                            {
    //                                "price": 9.99,
    //                                "description": "This is description # 1 ",
    //                                "name": "Item # 1",
    //                                "_id": "589430d6097e710409b8e456"
    //                            }
    //                        ]
    //                    }
    //                ]
    //            }
    //        }
    //    }
    //}

    inviteAddNew     :    {

        '200'   :   Joi.object().keys({
            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Invite Data Created successfully'),
            //data        :   Joi.object().keys({
            //    items   :   Joi.array().items({
            //        _id :   Joi.string()
            //    }).label('items')
            //}).example(anExmaple1).rename('_id','item_id',null)
            data        :   Joi.any().example(anExmaple1)
        }),//.rename('data','mydata',null)

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    },

/*    getAll  :   {

        '200'   :   Joi.object().keys({
            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Menu Data Updated successfully'),
            data        :   Joi.object().keys({
                merchant_id :   Joi.any(),//string().alphanum().length(24),
                menuData    :   Joi.object().keys({
                    menudata_id :   Joi.any(),//Joi.string().alphanum().length(24).required(),
                    images_menucards    :   Joi.object().keys({
                        paths   :   Joi.array().items(

                            Joi.object().keys({

                                id      :   Joi.number().min(0).example(0),
                                uri     :   Joi.string().uri({
                                    allowRelative   :   true
                                }).example("/some/url/location/where/file/is/placed/filename")
                            })
                        ),
                        curr_index  :   Joi.number().required()
                    }),
                    categories  :   Joi.array().items(
                        Joi.object().keys({
                            categoryName    :   Joi.string().required(),
                            category_id             :   Joi.any(),//Joi.string().alphanum().length(24).required(),
                            items           :   Joi.array().items(
                                Joi.object().keys({
                                    item_id     :   Joi.any(),//Joi.string().alphanum().length(24).required(),
                                    name    :   Joi.string().required(),
                                    description :   Joi.string().required(),
                                    price   :   Joi.number().required(),
                                    is_active   :   Joi.boolean()
                                }).rename('_id','item_id',null)
                            )
                        }).rename('_id','category_id',null)
                    )
                }).rename('_id','menudata_id',{override : true})
            })
        }),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    }*/


}




