/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;

var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var DonationAmountSchema =   new  Schema({
    dona_category_id : {type : mongoose.Schema.Types.ObjectId, ref: 'DonationCategory', required : true, default : null},
    mosque_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    title     :   {type : String, default : null},
    amount          :   {type : Number, default: 0.00},
    status     :   {type : Number, default : 1},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


DonationAmountSchema.virtual('dona_amount_id').get(function () {
    return this._id;
});


DonationAmountSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

DonationAmountSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.dona_amount_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

DonationAmountSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

DonationAmountSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.dona_amount_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    DonationAmountModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const DonationAmountModel = mongoose.model('DonationAmount', DonationAmountSchema, 'DonationAmount');


module.exports = {

    DonationAmountModel

}