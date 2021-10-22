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

module.exports  =   {

    changeLogo      :   {

        '200'       :   Joi.object().keys({

            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Merchant Logo Updated successfully'),
            data        :   Joi.object().keys({

                icon            :   Joi.string().uri({ allowRelative   :   true })
                                    .example("/some/url/location/where/file/is/placed/filename"),
                merchant_id     :   Joi.any().required()

            }).rename('_id', 'merchant_id', null).required()
        }).required(),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    },

    modifyGalleyImage      :   {

        '200'       :   Joi.object().keys({

            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Merchant Gallery Image Updated successfully'),
            data        :   Joi.object().keys({

                images_new      :   Joi.object().keys({
                    paths       :   Joi.array().min(1).items(
                        Joi.object().keys({
                            uri     :    Joi.string().uri({ allowRelative   :   true }).example("/some/url/location/where/file/is/placed/filename").required(),
                            image_id:    Joi.any().required(),
                            id      :    Joi.number().required()
                        }).rename('_id','image_id',null).optional()
                    )
                }).optional(),

                merchant_id     :   Joi.any().required(),
               // curr_index      :   Joi.number().required()
            })//.rename('_id', 'merchant_id', null).required()
        }).required(),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    },

    removeGalleyImage      :   {

        '200'       :   Joi.object().keys({

            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Gallery Image was successfully removed.'),
            data        :   Joi.object().keys({


                    path       : Joi.object().keys({
                            uri     :    Joi.string().uri({ allowRelative   :   true }).example("/some/url/location/where/file/is/placed/filename").required(),
                            image_id:    Joi.any().required(),
                            id      :    Joi.number().required(),
                            deleted :   Joi.boolean().example(true).required()
                        }).rename('_id','image_id',null).optional(),

                merchant_id     :   Joi.any().required(),

            })//.rename('_id', 'merchant_id', null).required()
        }).required(),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    },

    getDetails  :   {

        '200'   :   Joi.object().keys({

            success     :   Joi.boolean().example(true),
            message     :   Joi.string().required().example('Merchant details retrieved successfully.'),
            data        :   Joi.object().keys({

                merchant_id     :   Joi.any().required(),
                name: Joi.string().required(),
                website: Joi.string().optional(),
                vicinity: Joi.string().required(), 
                formatted_address: Joi.string().required(), 
                open_now : Joi.boolean(),
                formatted_phone_number: Joi.string().required(), 
                international_phone_number: Joi.string().required(), 
                aboutUs : Joi.any().required(),
                market_id : Joi.any().required(),
                market_name : Joi.any().required(),
                statistics : Joi.any().optional(),
                icon: Joi.string().uri({ allowRelative   :   true }).example("/some/url/location/where/file/is/placed/filename").required(),
                images   :   Joi.object().keys({

                    paths   :   Joi.array().items(
                        Joi.object().keys({
                            uri     :    Joi.string().uri({ allowRelative   :   true }).example("/some/url/location/where/file/is/placed/filename").required(),
                            image_id:    Joi.any().required(),
                            id      :    Joi.number().required()
                        }).rename('_id','image_id', {override: true}).optional()
                    ),
                    curr_index  :   Joi.number()

                }),

                menuData    :   Joi.object().keys({
                        menudata_id :   Joi.any(),
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
                                        description :   Joi.string().required().allow(""),
                                        price   :   Joi.number().required(),
                                        groundSchool           :   Joi.array().items(
                                            Joi.object().keys({
                                               _id     :   Joi.any(),//Joi.string().alphanum().length(24).required(),
                                                name    :   Joi.string().required(),
                                                status :   Joi.string().required()
                                            })//.rename('_id','_id', null)
                                        ),
                                        flightTime           :   Joi.array().items(
                                            Joi.object().keys({
                                               _id     :   Joi.any(),//Joi.string().alphanum().length(24).required(),
                                                name    :   Joi.string().required(),
                                                time :   Joi.string().required(),
                                                time_update :   Joi.string().optional(),
                                            })//.rename('_id','_id', null)
                                        ),
                                        checklist           :   Joi.array().items(
                                            Joi.object().keys({
                                               _id     :   Joi.any(),//Joi.string().alphanum().length(24).required(),
                                                name    :   Joi.string().required(),
                                                status :   Joi.string().required()
                                            })//.rename('_id','_id', null)
                                        ),
                                    }).rename('_id','item_id',null)
                                )
                            }).rename('_id','category_id',null)
                        )
                    }).rename('_id','menudata_id',null).allow(null)

            })//.rename('formatted_address','address', {override: true})
                .rename('images_new','images', {override: true})
                .optional()


        }).required(),

        '500'   :   commonErrors.error500,
        '400'   :   commonErrors.error400,
        '404'   :   commonErrors.error404
    }
}
