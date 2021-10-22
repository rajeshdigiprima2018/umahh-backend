/**
 * Created by rv2016 on 03/02/17.
 */

'use strict '

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


const MenuItemResp  =   require('./MenuItem');
const MerchantResp  =   require('./Merchant');
const UserResp  =   require('./User');


const validationSchemas = {

    mongooseID      :   Joi.string().alphanum().length(24).description('ALPHANUMERIC -  STRING  - REQUIRED'),//.required(),
    access_token    :   Joi.string().token().required(),
    uri             :   Joi.string().uri({ allowRelative   :   true }).example("/some/url/location/where/file/is/placed/filename").required(),
    mobile_mexico2   :   Joi.string().regex(/^\+521(((33|55|81){1}[1-8]{1}[0-9]{7})|((221|222|228|229|246|271|311|312|314|315|322|351|442|443|444|449|452|457|461|462|464|473|477|492|612|614|618|624|629|644|646|656|661|662|664|665|667|668|669|686|715|722|744|755|771|777|833|834|844|866|867|868|871|899|921|951|961|962|963|981|984|993|998|999){1}[1-8]{1}[0-9]{6}))$/).required(),
    mobile_mexico   :   Joi.string().regex(/^\+521(((33|55|81){1}[1-8]{1}[0-9]{7})|(([2-9][1-9][1-9]){1}[1-8]{1}[0-9]{6}))$/).required(),
    objectID        :   Joi.string().alphanum().max(24).required().description('ALPHANUMERIC -  STRING  - REQUIRED'),

}


const commonErrorResponses    = {

        error500    :
                        Joi.object().keys({
                            statusCode  :   Joi.number().min(200).max(500),
                            message     :   Joi.string(),
                            error       :   Joi.string()
                        }),

        error400    :
                        Joi.object().keys({
                            statusCode  :   Joi.number().min(200).max(500),
                            message     :   Joi.string(),
                            error       :   Joi.string(),
                            success     :   Joi.boolean().default(false),
                            message_readable    :   Joi.string(),
                            validation  :   Joi.object()
                        })
 }



module.exports =   {

    commonSchemas   :   validationSchemas,
    menuitems       :   MenuItemResp,
    merchants       :   MerchantResp,
    users       :   UserResp
    //commonErrors    :   commonErrorResponses
}