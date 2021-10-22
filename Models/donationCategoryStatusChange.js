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

var DonationCategoryStatusChangeSchema =   new  Schema({
    mosque_id      : {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    category :[/*{
        startDate     :   {type : Date, default   :   Date.now()},
        endDate       :   {type : Date, default   :   Date.now()},
        status     :   {type : Number, default : 1},
        createdAt   :   {type : Date, default   :   Date.now()},
        deletedAt   :   {type : Date, default   :   null},
        updatedAt   :   {type : Date, default   :   Date.now()}
    }*/]

});


DonationCategoryStatusChangeSchema.virtual('dona_category_st_id').get(function () {
    return this._id;
});


DonationCategoryStatusChangeSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

DonationCategoryStatusChangeSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.dona_category_st_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

DonationCategoryStatusChangeSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

DonationCategoryStatusChangeSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.dona_category_st_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    DonationCategoryStatusChangeModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const DonationCategoryStatusChangeModel = mongoose.model('DonationCategoryStatusChange', DonationCategoryStatusChangeSchema, 'DonationCategoryStatusChange');


module.exports = {

    DonationCategoryStatusChangeModel

}