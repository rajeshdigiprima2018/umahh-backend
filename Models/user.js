'use strict';

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const appConfig = require('../ENV').prefs;
const base = require('./index');
var Schema = mongoose.Schema;
var userSchema = new base.extendSchema({
    nameContactPerson: { type: String, default: null },
    isFBUser: { type: Boolean, default: false },
    isSelect: { type: Boolean, default: false },
    businessType: { type: String, default: null }, // checks for type of registration and user created there by
    avtar: { type: String, default: null }, // profile Picture of user
    deviceToken: { type: String, default: null },
    deviceType: { type: String, default: null },
    lat: { type: Number, default: 0.00 },
    lng: { type: Number, default: 0.00 },
    street_address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    mosque_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    associates_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Associates', default: null },
    following_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Following', default: null },
    zipCode: { type: String, default: null },
    vefication: { type: Number, default: 0 },
    phoneVerification: { type: Number, default: 0 },
    sessions: { type: [String], default: null },
    createdAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now() },
    randomToken: { type: Number, default: null },
    isEmailVerify: { type: Number, default: "0" },
    isUpdated: { type: Number, default: "0" },
    description_service: { type: String, default: null },
    geometry: {
        location: { lat: Number, lng: Number },
        viewport: {
            northeast: { lat: Number, lng: Number },
            southwest: { lat: Number, lng: Number }
        }
    }, // This must be auto captured from Admin client interface
    timezone: { type: String, default: "Asia/Kolkata" },
    locSearch: { // This specific property would be used to get Near by Geo Spatial Search & Sorted by Distance

        type: [Number], // [<longitude>, <latitude>] // Must follow this sequence when inserting values
        index: { type: '2dsphere', sparse: false } // create the geo spatial index
    },
    notification: { type: Boolean, default: false },
    aap_language: { type: String, default: "en" },
    quaran_translate: { type: String, default: "en" },
    prayer_translate: { type: String, default: "en" },
    forgotPassword: { type: Boolean, default: false },
});
userSchema.virtual('user_id').get(function() {

    return this._id;
});

userSchema.set('toObject', { versionKey: false, retainKeyOrder: true, virtuals: true });

userSchema.options.toObject.transform = function(doc, ret, options) {

    delete ret.__v;
    delete ret.password;
    // delete ret.createdAt;
    delete ret.totalCancels;
    delete ret.totalSpent;
    delete ret.conekta;
    ret.user_id = ret._id

    //console.log('-----Xform -----\n', ret);

    return ret;
};



userSchema.methods.toPublic = function() {

    var obj = this.toObject();
    delete obj.__v;
    delete obj.password;
    // delete obj.createdAt;
    delete obj.totalCancels;
    delete obj.totalSpent;
    delete ret.conekta;
    ret.user_id = ret._id

    return obj;
};



userSchema.methods.logOut = function() {

    execute(function() {

        console.log("this : ", this);
        var currUser = this.model('User');

        currUser.isLoggedIn = false;
        currUser.access_token = null;

        currUser.save(function(err) {

            if (err) {

                return (err);
            } else {

                return ("User Logged out Successfully.");
            }
        });

    });
};



userSchema.statics.checkUniqueness = function(username, emailaddress, cb) {

    //execute(function(){

    console.log(username);

    console.log(emailaddress);

    if (username) {

        console.log("checking against UserName and Email");

        return this.findOne({ username: username }, cb);
    } else {

        console.log("checking against Email only");
        return this.findOne({ email: emailaddress }, cb);
    }


};

userSchema.statics.checkUniquenessUser = function(emailaddress, cb) {

    //execute(function(){


    if (emailaddress) {

        return this.findOne({ email: emailaddress }, cb);
    } else {

        return this.findOne({ email: emailaddress }, cb);
    }


};



userSchema.statics.whiteListFields = { password: 0, __v: 0, totalCancels: 0, totalSpent: 0 };



var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

const UserModel = mongoose.model('User', userSchema, 'User');


module.exports = {

    UserModel
};