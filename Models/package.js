/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var PackageSchema =   new  Schema({

    packageName        :   {type : String, default : null},
    amount             :   {type : Number, default : 0.00},
    description         :   {type : [], default: null},
    days               :   {type : Number, default : 0.00},
    status             :   {type : String, default : null},  
    createdAt          :   {type: Date, default: Date.now},
    updatedAt          :   {type: Date, default: Date.now},

    // Shipping details are delivery details and are captured in below field -Object
 

});


PackageSchema.virtual('package_id').get(function () {
    return this._id;
});


PackageSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

PackageSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.package_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

PackageSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

PackageSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.package_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find      =   function(criteria, projection, cb){

    PaymentModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const PackageModel = mongoose.model('Package', PackageSchema, 'Package');


module.exports = {

    PackageModel

}