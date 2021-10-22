/**
 * Created by rv2016 on 04/11/16.
 */


'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
const appConfig = require('../ENV').prefs;


var merchantSchema = new mongoose.Schema({

    geometry: { location: {lat : Number, lng : Number} ,
                viewport: {
                    northeast: {lat : Number, lng : Number} ,
                    southwest:{lat : Number, lng : Number}
                }
    }, // This must be auto captured from Admin client interface

    locSearch   :   {   // This specific property would be used to get Near by Geo Spatial Search & Sorted by Distance

        type: [Number],  // [<longitude>, <latitude>] // Must follow this sequence when inserting values
        index: '2d'      // create the geo spatial index
    },

    icon: String,   // image data // while writing to database, the location of image (path) as string will be stored.
    id: String,     // auto generated or assigned
    name: String,
    //opening_hours: { open_now: {type : Boolean, default  : false},           // this will be calculated property
    //                weekday_text: [String] },   // this will be database content as it is . No calculation
    open_now     :  {type : Boolean, default  : false},
    place_id: String,   // auto-generated alpha-numeric key
    rating      :   {type : Number, default :   0.5},     // calculated or queried property
    reference: String,  // optional
    types: [ String ],  // optional
    vicinity: String,   // near by Landmark
    photos : [{height: Number, width : Number, photo_reference : String }], // Optional
    //images:[String],
    isExternal : {type : Boolean, default  : false}, // This indicates whether the Merchant data is gathered from External API like Google Places or not.
                        // Make this 'true' for data acquired from Google APIs.
    promotions : [],    // an Array of Promotion Objects --  to be defined later
    hasLoyaltyScheme : {type : Boolean, default  : false} , // shows whether the merchant currently provides any Loyalty Point system or not.
    hasDelivery : Boolean,         // show whether the merchant provides home delivery or not
    formatted_address : String, // Properly formatted address
    formatted_phone_number :  String,   // e.g. "01 55 6078 7854"
    international_phone_number :  String,   // e.g. "+52 55 6078 7854"
    website :  String,  //  e.g. www.restaurante.com
    images_new : {  curr_index : {type : Number, default : -1},
                    paths   :   [
                        {
                            id  :   {type   :   Number, default :   -1},
                            uri :   String
                        }
                    ]},
    //menuData    :   {type : menuItemDataModelSchema, required : false, default : null},
    admin       :   {type : {
        admin_id    :   {type : mongoose.Schema.Types.ObjectId, required : true, default : null}
    }, default : null},
    orders     :   {type : [mongoose.Schema.Types.ObjectId], default : []},
    statistics :    {
                        type :{
                            orders  :   {
                                type : {
                                    received    :    {type : Number, default : 0},
                                    cancelled   :    {type : Number, default : 0}
                                }, default : null},
                            revenue :   {
                                type : {
                                    received    :    {type : Number, default : 0.00},
                                    cancelled   :    {type : Number, default : 0.00},
                                    refunded    :    {type : Number, default : 0.00}
                                }, default : null},
                            ratings :   {
                                type:{
                                    received    :   {type : Number, default : 0}
                                }, default : null}
                        }, default : null},

    market_id           :   {type : mongoose.Schema.Types.ObjectId, default : null},
    market_name         :   {type : String, default : null},
    aboutUs             :   {type : String, default : null},
    locale : {type : String,  enum : [appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH], default : appConfig._LOCALE.ENGLISH},


});

merchantSchema.virtual('merchant_id').get(function () {

    return this._id;
});


merchantSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

merchantSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.merchant_id = ret._id
    delete ret._id;
    return ret;
}


merchantSchema.set('toJSON', { versionKey : false, virtuals : true, retainKeyOrder : true});

merchantSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.merchant_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

merchantSchema.methods.getName  =   function(){

    let currMerchant  = this.model('Merchant');

    return currMerchant.name;
}


//merchantSchema.methods  =   {
//
//    findMany        :       function(criteria,projection,options, callback){
//
//    }
//}

var groupByMarket   =   function(marketID, callback){

    console.log("market  in getByMarket func  :", marketID);

    //MerchantModel.find({market_id : marketID}, callback);


    MerchantModel
        .find({market_id : marketID})
        .select('merchant_id name hasLoyaltyScheme formatted_address formatted_phone_number international_phone_number icon open_now icon geometry website rating')
        .exec(callback);

}

merchantSchema.statics  =   {

    getByMarket     :   groupByMarket
}


const MerchantModel = mongoose.model('Merchant', merchantSchema, 'Merchant');


module.exports = {

    MerchantModel
}
