/**
 * Created by rv2016 on 14/11/16.
 */

"use strict";

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const Path = require('path');
const Faker  = require('faker/locale/en_US');


var helpers_generic = require('../yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../../Models/merchant').MerchantModel;
//var OrderModel  =   require('../../Models/order').OrderModel;
//var UserModel = require('../../Models/user').UserModel;
const globalVars = require('../../index');



var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}


// Error Enums

const BLErrors  =   {

    MERCHANT_NOT_FOUND          :       'Merchant not found',
    MERCHANT_DUPLICATE_FOUND    :       'Duplicate Merchants with same ID are found.',
    UNSUPPORTED_FILE_TYPE       :       'Server cant not accept the file type provided',
    FILE_SIZE_ZERO              :       'File contains no data',
    FILE_RENAME_FAILED          :       'File Rename Operation Failed',
    FILE_WRITE_FAILED           :       'File Write Operation Failed',
    FILE_DELETE_FAILED          :       'File Delete Operation Failed',
    FILE_GENERIC_ERROR          :       'File operation failed',
    GALLERY_PATH_NOT_FOUND      :       'Gallery path not found'

};



module.exports.funcs_m = {


    getAll: function getAllMerchants(request, reply) {


        setTimeout(function () {

                MerchantModel
                    .find()
                    .select('_id name hasLoyaltyScheme formatted_address formatted_phone_number international_phone_number icon open_now icon geometry')
                    .exec(function (err, merchants) {

                        console.log('inside mongoose operation.');

                        if (err) {

                            console.error(err);

                            reply({
                                success: false,
                                error: err
                            });
                        }
                        else {

                            reply({
                                success: (merchants != null && merchants.length > 0) ? true : false,
                                data: {
                                    merchants: (merchants != null && merchants.length > 0) ? merchants.map(function (element) {

                                        return element.toObject();
                                    }) : null
                                }
                            });
                        }
                    });
            },
            1);

        console.log('Execution reached out of block');

    },

    getDetails: function getDetailsOfMerchant(request, reply) {

        setTimeout(function () {

                MerchantModel
                    .findOne({_id: request.params.merchant_id})
                    //.select('-__v -images -promotions -types -place_id -reference')
                    .select('_id name vicinity formatted_address formatted_phone_number international_phone_number icon images_new menuData open_now statistics aboutUs market_id market_name website')
                    .exec(function (err, merchant) {

                        console.log('inside mongoose operation.');

                        if (err) {

                            console.error(err);

                            reply({
                                success: false,
                                error: err,
                                message :   "Error occurred getting details of merchant"
                            });
                        }
                        else {

                            //console.log(merchant);

                            reply({
                                success: merchant != null ? true : false,
                                data: merchant != null ? merchant.toObject() : null,
                                message :   'Merchant details retrieved successfully'
                            });


                        }

                    });
            },
            1);

        console.log('Execution reached out of block');
    },

    fetchImages: function getAllMerchantImages(request, reply) {

        MerchantModel.find(function (err, merchants) {

            if (err) {

                console.error(err);

                reply({
                    success: false,
                    error: err
                });
            }
            else {

                // console.log(merchants);

                //async.each(merchants,iterator,finalCallBack);

                var downloadImages = function (merchant, callback) {

                    if (merchant.images.length == 0) {

                        return callback(null, []);
                    }

                    let arrFilePaths = [];

                    for (var i = 0; i < merchant.images.length; i++) {

                        console.log(i);

                        var imagePaths = [];

                        helpers_generic.downloadImage(merchant.images[i], (merchant.id + '_' + i + '.png'),
                            function (err, message, data) {

                                console.log(message);

                                if (err) {

                                    console.log('error' + JSON.stringify(err));

                                    callback(err, null);

                                }
                                else {


                                    imagePaths.push('/public/images/' + data.filename);

                                    console.log(JSON.stringify(imagePaths));

                                    console.log(imagePaths.length);

                                    if (imagePaths.length == merchant.images.length) {

                                        console.log('sending to iterator');

                                        callback(null, imagePaths);
                                    }

                                }
                            });
                    }


                    var cb1 = function (err, message, data) {

                        console.log(message);

                        if (err) {

                            console.log('error' + JSON.stringify(err));
                        }
                        else {

                            console.log(JSON.stringify(data));
                        }
                    };


                };

                var iterator = function (item, callback) {

                    console.log('iterator');
                    //console.log(item);
                    let arrURLs = createImageURL(item);
                    console.log(arrURLs);

                    downloadImages({
                            id: item.place_id,
                            images: arrURLs
                        },
                        function (err, data) {

                            if (err != null) {

                                iteratorCallback(err, null, merchants.length);
                            }
                            else {

                                item.images = data;

                                iteratorCallback(null, item, merchants.length);
                            }
                        });

                    //createImageURL(merchants[item]);
                };

                /*
                 lupus(0, merchants.length, iterator,finalCallBack);
                 */

                var cb = function (result) {

                    console.log('callback result :' + result);
                };

                var asyncIterator = function (size, cb) {

                    console.log(size);

                    var x = 0;
                    for (var i = 0; i < size; i++) {

                        //console.log(i);
                        x = i;
                    }

                    console.log('completed loop of ' + size + 'cycles');
                    console.log(x);

                    if (x < 20) {
                        cb({err: 'Under Limit'});
                    }
                    else {
                        cb(null);
                    }


                };


                async.each(merchants, function (size, cb) {

                    setTimeout(function () {

                        //asyncIterator(size,cb);

                        iterator(size, cb);

                    }, 1);

                }, finalCallBack);


                //var interval = setInterval(async.each(merchants,iterator,finalCallBack),1);


                /*
                 async.waterfall(
                 [
                 function(){

                 for (var merchant in merchants){

                 //for(var counter = 0; counter < merchants.length ; counter++){

                 console.log(merchants[merchant]);
                 }
                 }

                 ],
                 [],
                 function(err,data){

                 console.log('inside Final Callback');

                 if(! err){

                 reply({
                 success : true,
                 data : {
                 merchants : merchants
                 }
                 });
                 }
                 else{

                 reply({
                 success : false,
                 error : err
                 });
                 }
                 });

                 */


                console.log('Execution reached out of block');

                //reply({
                //    success : true,
                //    data : {
                //        merchants : merchants
                //    }
                //});
            }

        });

        //function iterator(item, callback){
        //
        //    console.log('iterator');
        //    console.log(item);
        //    createImageURL(item);
        //}


        var arrModifiedMerchants = [];

        function iteratorCallback(error, data, size) {

            if (error) {

                console.error(error);
            }
            else {

                arrModifiedMerchants.push(data);

                if (arrModifiedMerchants.length == size) {

                    console.log('Now inserting Merchants.');

                    var updatedMoels = [];

                    for (var aMerchant in arrModifiedMerchants) {

                        let anItem = arrModifiedMerchants[aMerchant];

                        //console.log(anItem.images);

                        MerchantModel.update({place_id: anItem.place_id}, anItem, function (err, updatedDoc) {

                            if (err) {

                                console.log(err);

                                reply({

                                    success: false,
                                    error: err
                                });
                            }
                            else {

                                console.log(updatedDoc);

                                updatedMoels.push(updatedDoc);
                            }
                        })
                    }

                    console.log('sending response to client');
                    reply({

                        success: true,
                        data: {
                            merchants: arrModifiedMerchants
                        }
                    });

                }

            }

        }

        function finalCallBack(err) {

            console.log('inside final callback. Error Must have occured.');

            console.log('return data :' + JSON.stringify(err));
        }

        function createImageURL(merchant) {

            console.log(merchant.place_id);

            var arrUrls = [];

            for (var photo = 0; photo < merchant.photos.length; photo++) {

                let aPhoto = merchant.photos[photo];

                var url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + aPhoto["photo_reference"] + '&key=AIzaSyDpayKkzK1RWDxjNN8dZ_tFFaZ1HPAczBY';

                //console.log(url);

                arrUrls.push(url);

            }

            return arrUrls;

        }

    },

    externalData_insert_merchants: function (request, reply) {

        console.log('Reuqest Received.Starting processing');

        let options = {

            url: 'https://maps.googleapis.com/maps/api/place/search/json?name=nanaya&keyword=nanaya&location=19.672332,-99.42627&radius=33000&types=restaurant&sensor=true&key=AIzaSyDpayKkzK1RWDxjNN8dZ_tFFaZ1HPAczBY',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
        }

        rq(options, function (error, response, body) {

            if (!error && response.statusCode == 200) {

                let jsonBody = JSON.parse(body);

                var results = jsonBody.results;

                var merchants = results;

                var downloadImages = function (merchant, callback) {

                    if (merchant.images.length == 0) {

                        return callback(null, []);
                    }

                    let arrFilePaths = [];

                    for (var i = 0; i < merchant.images.length; i++) {

                        console.log(i);

                        var imagePaths = [];

                        helpers_generic.downloadImage(merchant.images[i], (merchant.id + '_' + i + '.png'),
                            function (err, message, data) {

                                console.log(message);

                                if (err) {

                                    console.log('error' + JSON.stringify(err));

                                    callback(err, null);

                                }
                                else {


                                    imagePaths.push('/public/images/' + data.filename);

                                    console.log(JSON.stringify(imagePaths));

                                    console.log(imagePaths.length);

                                    if (imagePaths.length == merchant.images.length) {

                                        console.log('sending to iterator');

                                        callback(null, imagePaths);
                                    }

                                }
                            });
                    }


                    var cb1 = function (err, message, data) {

                        console.log(message);

                        if (err) {

                            console.log('error' + JSON.stringify(err));
                        }
                        else {

                            console.log(JSON.stringify(data));
                        }
                    };


                };

                var iterator = function (item, callback) {

                    console.log('iterator');
                    //console.log(item);
                    let arrURLs = createImageURL(item);
                    //console.log(arrURLs);

                    downloadImages({
                            id: item.place_id,
                            images: arrURLs
                        },
                        function (err, data) {

                            if (err != null) {

                                iteratorCallback(err, null, merchants.length);
                            }
                            else {

                                item.images = data;

                                console.log(item);

                                iteratorCallback(null, item, merchants.length);
                            }
                        });

                    //createImageURL(merchants[item]);
                };

                /*
                 lupus(0, merchants.length, iterator,finalCallBack);
                 */

                var cb = function (result) {

                    console.log('callback result :' + result);
                };

                var asyncIterator = function (size, cb) {

                    console.log(size);

                    var x = 0;
                    for (var i = 0; i < size; i++) {

                        //console.log(i);
                        x = i;
                    }

                    console.log('completed loop of ' + size + 'cycles');
                    console.log(x);

                    if (x < 20) {
                        cb({err: 'Under Limit'});
                    }
                    else {
                        cb(null);
                    }


                };


                async.each(merchants, function (size, cb) {

                    setTimeout(function () {

                        //asyncIterator(size,cb);

                        iterator(size, cb);

                    }, 1);

                }, finalCallBack);


                console.log('Execution reached out of block');


                /*
                 MerchantModel.insertMany(results,function(err,docs){

                 if(err){

                 console.log(err);

                 reply({

                 success : false,
                 error   :   err
                 });
                 }
                 else{

                 console.log('sending response to client');
                 reply({

                 success : true,
                 data:{
                 merchants:docs
                 }
                 });
                 }
                 });

                 */

                var arrModifiedMerchants = [];

                var iteratorCallback = function iteratorCallback(error, data, size) {

                    if (error) {

                        console.error(error);
                    }
                    else {

                        arrModifiedMerchants.push(data);

                        if (arrModifiedMerchants.length == size) {

                            console.log('Now inserting Merchants.');

                            MerchantModel.insertMany(arrModifiedMerchants, function (err, docs) {

                                if (err) {

                                    console.log(err);

                                    reply({

                                        success: false,
                                        error: err
                                    });
                                }
                                else {

                                    console.log('sending response to client');
                                    reply({

                                        success: true,
                                        data: {
                                            merchants: docs
                                        }
                                    });
                                }
                            });

                        }

                    }

                }

                var finalCallBack = function finalCallBack(err) {

                    console.log('inside final callback. Error Must have occured.');

                    console.log('return data :' + JSON.stringify(err));
                }

                var createImageURL = function createImageURL(merchant) {

                    if (merchant.hasOwnProperty("photos") == false) {

                        return [];
                    }
                    console.log(merchant.place_id);

                    var arrUrls = [];

                    for (var photo = 0; photo < merchant.photos.length; photo++) {

                        let aPhoto = merchant.photos[photo];

                        var url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + aPhoto["photo_reference"] + '&key=AIzaSyDpayKkzK1RWDxjNN8dZ_tFFaZ1HPAczBY';

                        //console.log(url);

                        arrUrls.push(url);

                    }

                    return arrUrls;

                }


            }
            else {
                console.log(error);
                console.log(response);
                reply({
                    success: false,
                    error: error,
                    response: response
                });
            }
        });
    },

    addNew: function (request, reply) {

        var data = request.payload;

        console.log(request.payload.geometry.location.lat);

        if (data.image) {

            var name = data.image.hapi.filename;
            let filename = 'logo_' + name;
            let path = 'Media/Images/Merchants/Logos/' + filename;

            //helpers_generic.saveImageToPath(data.image,filename, path,'/public/images/Logos/', function(err,message,result){

            helpers_generic.saveImageToPath(data.image, filename, path, '/public/images/Merchants/Logos/', function (err, message, result) {

                console.log('inside [saveImageToPath] callback function');
                console.log('message : ' + message);
                console.log('error : ' + err);

                console.log('sending Reply to client');

                if (result != null) {

                    console.log(result);

                    data.icon = result.url;

                    console.log(data);

                    var newMerchant = new MerchantModel(data);

                    newMerchant.save(function (err) {

                        if (err) {

                            reply({

                                success: false,
                                error: err
                            });
                        }
                        else {

                            console.log('New Merchant inserted and created successfully');

                            reply({
                                success: true,
                                data: {
                                    merchant: newMerchant
                                }
                            });
                        }
                    });

                    console.log('Image received and parsed successfully.');

                }
                else if (err != null) {

                    let responseX = ({
                        success: false,
                        'error': err
                    });
                    console.log(responseX);

                    reply(responseX);

                    console.log('Image could not be saved.');
                }

            });

            //var file = fs.createWriteStream(path);
            //
            //file.on('error', (err) => {
            //    console.error(err);
            //});
            //file.on('open', (err) => {
            //    data.image.pipe(file);
            //});
            //
            //data.image.on('end', (err) => {
            //    var ret = {
            //        filename: data.image.hapi.filename,
            //        headers: data.image.hapi.headers,
            //        url     : '/public/images/'+filename
            //    }
            //    //reply(ret);
            //
            //
            //
            //
            //    console.log('Image received and parsed successfully.');
            //});

            console.log('final line on block');
        }
        else {

            console.log('No Image Data received on Request payload');

            reply({

                success: false,
                error: {
                    context: 'validation',
                    field: 'image',
                    cause: "field_missing"
                }
            });

        }
    },

    addNewR: function (request, reply) {

        var aFunc = function () {

            let authAdmin = globalVars.authUser;

            if(authAdmin.role.toLowerCase() !== 'admin'){

                return sendErrorReply('Invalid Admin access detected','Problem authenticating valid Admin',404, reply);
            }
            //else if(authAdmin.merchants && authAdmin.merchants.length > 0){
            //
            //    return sendErrorReply('Admin already possess a merchant account.Only one admin per account allowed','Admin validation failed',404, reply);
            //}

            var data = request.payload;

            data.admin  =  {

                admin_id    :    authAdmin._id
            }

            console.log(request.payload.geometry.location.lat);

            data.locSearch = [data.geometry.location.lng, data.geometry.location.lat];

            data.icon    =   "/public/images/Merchants/Logos/logo_default.png";

            console.log("payload data : \n", data);

            // create Merchant user first

            var newMerchant = new MerchantModel(data);

            newMerchant.save(function (err, docSaved, rowsAffected) {

                if (err != null || rowsAffected == 0) {

                    reply({

                        success: false,
                        error: err || 'Server Error Occured.'``
                    });
                }
                else if (docSaved) {

                    console.log('New Merchant inserted and created successfully');

                    authAdmin.merchants.push(docSaved._id);

                    authAdmin.save(function (err, savedDoc, numRowsAffected) {

                        if(savedDoc){

                            reply({
                                success: true,
                                data: {
                                    merchant: docSaved
                                },
                                message :   'New Merchant account created successfully'
                            });
                        }
                        else if(err != null || numRowsAffected == 0){

                            return sendErrorReply(err != null ? err.message : 'Updating Admin data failed', 'Error occurred creating a new merchant account',404, reply);
                        }
                        else{

                            return sendErrorReply('Unknown server error occurred', 'Error occurred creating a new merchant account',400, reply);
                        }
                    })


                }

            });
        }

        execute(aFunc);

    },

    changeLogo: function (request, reply) {

        var aFunc = function () {

            var data = request.payload;
            data.merchant_id    =   request.params.merchant_id;

            // check if merchant exists in system
            MerchantModel.findOne({_id: request.params.merchant_id}, {_id: 1, icon: 1}, null, function (err, doc) {

                console.log("error : ", err, "\n result : ", doc);

                if (doc != null && doc != undefined) {

                    if (data.image_logo && data.image_logo.size !== 0) {

                        var name = data.image_logo.hapi.filename;

                        console.log(data.image_logo.hapi.headers);

                        var extension = Path.extname(name);

                        //if(extension == null || extension == undefined || extension.length == 0){

                        /*
                         { 'content-disposition': 'form-data; name="image_logo"; filename="05-Settings.png"',
                         'content-type': 'image/png' }
                         */

                        let payloadHeaders = data.image_logo.hapi.headers;

                        if (payloadHeaders.hasOwnProperty("content-type") == true) {

                            let contentType = payloadHeaders['content-type'];

                            if (contentType.indexOf('image/', 0) != -1) {

                                let startIndex = contentType.toLowerCase().indexOf('image/', 0) + 'image/'.length;

                                let newExtension = contentType.substring(startIndex);

                                console.log("new Extension :", newExtension);

                                if (newExtension != null && newExtension != undefined && newExtension.length > 0) {

                                    extension = '.' + (newExtension.toLowerCase());
                                }
                            }
                            else {

                                return sendErrorReply(BLErrors.UNSUPPORTED_FILE_TYPE, BLErrors.UNSUPPORTED_FILE_TYPE, 404, reply);
                            }
                        }
                        else {

                            console.log('No content-type field found in payload headers');
                        }

                        // }
                        let timestamp = Date.now().toString();
                        let filename = 'logo_' + data.merchant_id + '_' + timestamp + extension;  //+ name;
                        let path = 'Media/Images/Merchants/Logos/' + filename;

                        let deletePath = null;

                        if (data.hasOwnProperty("path") == true) {

                            //deletePath =   data.path.replace("/public/images/","./Media/Images/Merchants/");
                            deletePath = data.path.replace("/public/images/", "./Media/Images/");
                        }

                        if (doc.icon != null && doc.icon != undefined &&
                            doc.icon.length > 0 && (doc.icon.indexOf("logo_default.png") != -1)) {

                            console.log("Trying to Delet Default logo file :", doc.icon , " -- Denied Operation" );

                            //deletePath = doc.icon.replace("/public/images/", "./Media/Images/");
                        }
                        else{

                            console.log("Trying to Delete non-Default logo file :", doc.icon , " -- Allowed Operation" );
                            deletePath = doc.icon.replace("/public/images/", "./Media/Images/");
                        }


                        //helpers_generic.saveImageToPath(data.image_logo,filename, path,'/public/images/Logos/', function(err,message,result) {
                        helpers_generic.saveImageToPath(data.image_logo, filename, path, '/public/images/Merchants/Logos/', function (err, message, result) {
                            console.log('inside [saveImageToPath] callback function');
                            console.log('message : ' + message);
                            console.log('error : ' + err);

                            console.log('sending Reply to client');

                            if (result != null) {

                                console.log(result);

                                console.log(data.merchant_id);

                                doc.icon = result.url

                                doc.save(function (err, merchant, rowsAffected) {

                                    if (err && rowsAffected == 0) {

                                        console.error(err);

                                        return sendErrorReply(err, 'Error occurred updating merchant logo', 404, reply);
                                    }
                                    else if (merchant != null && merchant != undefined) {

                                        console.log("merchant :", merchant);

                                        reply({
                                            success: merchant != null,
                                            data: {
                                                _id: merchant._id,
                                                icon: merchant.icon
                                            },
                                            message: 'Merchant logo updated successfully'
                                        });


                                        if (deletePath != null) {

                                            setTimeout(function () {

                                                helpers_generic.deleteFile(deletePath, function (err) {

                                                    if (err) {

                                                        console.log('problem deleting merchant logo file at path' + deletePath + '\n Error : ' + err);

                                                        return sendErrorReply(err, 'Error occurred deleting merchant logo', 404, reply);

                                                    }
                                                    else {

                                                        console.log('successfully deleted merchant logo file at path' + deletePath);
                                                    }
                                                });

                                            }, 1);
                                        }


                                    }
                                });


                                console.log('Image received and updated successfully.');
                            }
                            else {

                                if (err != null) {

                                    return sendErrorReply(err, "Error occurred updating merchant logo", 404, reply);
                                }
                                else {

                                    return sendErrorReply("unknown Error occurred", "Error occurred updating merchant logo", 500, reply);
                                }
                            }

                        });
                    }
                    else {

                        return sendErrorReply('No Image Data received.', 'Error occurred updating merchant logo', 400, reply)
                    }
                }
                else {

                    if (err != null) {

                        return sendErrorReply(err, 'Error occurred updating merchant logo', 404, reply);
                    }
                    else {

                        return sendErrorReply('Merchant not found', 'Error occurred updating merchant logo', 404, reply);
                    }
                }
            });

        };

        execute(aFunc);
    },

    // This method is deprecated now
    addGalleryImage: function (request, reply) {

        setTimeout(function () {

            asyncFunc();

        }, 1);

        var asyncFunc = function () {

            // validate payload for pre-requisites

            console.log(request.payload);

            console.log(request.payload.path == null);

            let isInsert = request.payload.path == null;// checks whether the operation is -- INSERT or UPDATE

            console.log('operation : INSERT :' + isInsert == true);

            let merchant = null;

            // get the valid merchant object referred from Payload

            MerchantModel.find({_id: request.payload.merchant_id}, function (err, result) {

                if (err) {

                    console.error(err);

                    return reply({

                        success: false,
                        error: err
                    });

                }
                else {

                    console.log('found valid merchant as :\n', result);

                    // find the path object referred from Payload

                    merchant = result[0];

                    let gallery = merchant.images_new;

                    console.log(gallery);

                    saveImage(gallery);


                }
            });


            // now save the image to specified Path

            var saveImage = function (gallery) {

                // build the filename, filePath and save new image using incoming stream

                var data = request.payload;

                if (data.image_gallery && data.image_gallery.size !== 0) {

                    // gallery.curr_index++;

                    var extension, filename, name, filename = null;

                    var isExtensionDiffer = false;


                    // New code starts


                    gallery.curr_index = isInsert == true ? gallery.curr_index + 1 : gallery.curr_index;

                    if (isInsert == false) {

                        var newExtension = Path.extname(data.image_gallery.hapi.filename);

                        var extension = Path.extname(data.path.uri);

                        filename = Path.basename(data.path.uri).replace(extension, newExtension);

                        console.log('modify opertaion');

                        console.log(newExtension);
                        console.log(extension);

                        if (( newExtension === extension ) == true) {

                            isExtensionDiffer = false;
                        }
                        else {

                            isExtensionDiffer = true;
                        }

                        console.log('modify opertaion filename');
                        console.log(filename);

                    }
                    else {
                        // New code ends

                        name = data.image_gallery.hapi.filename;

                        extension = Path.extname(name);

                        filename = request.payload.merchant_id + '_' + gallery.curr_index + extension;//'logo_' + name;

                    }// New code line

                    let directory = 'Media/Images/Merchants/' + request.payload.merchant_id + '/';

                    helpers_generic.checkORCreateDirectory(directory, '0777', function (err) {

                        if (err) {

                            console.error(err);

                            return reply({

                                success: false,
                                error: err
                            });

                        }

                    });

                    let path = directory + filename;

                    //let uri = '/public/images/' + request.payload.merchant_id + '/';

                    let uri = '/public/images/Merchants/' + request.payload.merchant_id + '/';

                    let deletePath = null;

                    if (isInsert == false) {

                        //deletePath = data.path.uri.replace("/public/images/","./Media/Images/Merchants/");

                        deletePath = data.path.uri.replace("/public/images/", "./Media/Images/");
                    }


                    helpers_generic.saveImageToPath(data.image_gallery, filename, path, uri, function (err, message, result) {

                        console.log('inside [saveImageToPath] callback function');
                        console.log('message : ' + message);
                        console.log('error : ' + err);

                        console.log('sending Reply to client');

                        if (result != null) {

                            console.log(result);

                            console.log(data.merchant_id);

                            if (isInsert == true) {

                                gallery.paths.push({

                                    id: gallery.curr_index,
                                    uri: result.url
                                });
                            }
                            else {
                                let aPosition = -99;

                                var aFilter = function (currValue, index, arr) {

                                    console.log(currValue);
                                    console.log(index);
                                    console.log(arr);
                                    console.log(data.path.id);


                                    if (data.path.id == currValue.id) {

                                        console.log('match found at index :' + index);
                                        aPosition = index;
                                        return index;
                                    }
                                };


                                let aPath = gallery.paths.find(aFilter);

                                console.log('Path found  :' + aPath);

                                if (aPath != null && aPath != undefined && aPosition >= 0) {

                                    aPath.uri = result.url;//filename;
                                    gallery.paths[aPosition] = aPath;//request.payload.path;
                                    //gallery.paths[index].uri = filename;
                                }

                            }

                            ////
                            let options = {

                                new: true,                         // returns new modified object
                                setDefaultsOnInsert: true,            // sets defaults values on insert
                                upsert: true
                            };

                            console.log('new gallery : ' + gallery);

                            console.log('menu data : ' + merchant.menuData);

                            MerchantModel.findOneAndUpdate({_id: data.merchant_id}, {$set: {images_new: gallery}}, options, function (err, merchant) {

                                if (err) {

                                    console.error(err);

                                    reply({

                                        success: false,
                                        error: err
                                    });


                                }
                                else {

                                    console.log('Merchant logo modified successfully');

                                    reply({
                                        success: merchant != null,//? false : true,
                                        data: {
                                            merchant: merchant
                                        }
                                    });


                                    if (isInsert == false && isExtensionDiffer == true) {

                                        setTimeout(function () {

                                            console.log('Attempting to delete file at path : ' + deletePath);

                                            helpers_generic.deleteFile(deletePath, function (err) {

                                                if (err) {

                                                    console.log('problem deleting file at path' + data.path + '\n Error : ' + err);
                                                }
                                                else {

                                                    console.log('successfully deleted file at path' + data.path);
                                                }
                                            });

                                        }, 1);
                                    }


                                }
                            });

                            ////

                            console.log('Image received and updated successfully.');

                        }


                    });
                }
                else {
                    reply({
                        success: false,
                        error: 'No Image Data received.'
                    });
                }

            };

        };

        console.log('control reaches end of main block');


    },

    // This method is deprecated now
    deleteGalleryImage: function (request, reply) {

        setTimeout(function () {

            asyncFunc();

        }, 1);

        var asyncFunc = function () {

            // validate payload for pre-requisites

            let merchant = null;

            let data = request.payload;

            // get the valid merchant object referred from Payload

            MerchantModel.find({_id: request.payload.merchant_id}, function (err, result) {

                if (err) {

                    console.error(err);

                    return reply({

                        success: false,
                        error: err
                    });

                }
                else {

                    console.log('found valid merchnat as :\n', result);

                    // find the path object referred from Payload

                    merchant = result[0];

                    let gallery = merchant.images_new;

                    console.log(gallery);

                    deleteImage(gallery);


                }
            });

            var deleteImage = function (gallery) {

                //var deletePath = data.path.uri.replace("/public/images/","./Media/Images/Merchants/");

                var deletePath = data.path.uri.replace("/public/images/", "./Media/Images/");

                setTimeout(function () {

                    console.log('Attempting to delete file at path : ' + deletePath);

                    helpers_generic.deleteFile(deletePath, function (err) {

                        if (err) {

                            console.log('problem deleting file at path' + data.path + '\n Error : ' + err);
                        }
                        else {

                            console.log('successfully deleted file at path' + data.path);

                            let newPaths = [];

                            newPaths = gallery.paths.filter(function (el) {

                                console.log('is same path object :', el.id === data.path.id);

                                return el.id !== data.path.id
                            });

                            gallery.paths = newPaths;

                            console.log('new gallery paths:' + gallery.paths);
                            console.log('new gallery paths:' + gallery.paths.length);

                            if (gallery.paths.length == 0) {

                                gallery.curr_index = -1;
                            }

                            ////
                            let options = {

                                new: true,                         // returns new modified object
                                setDefaultsOnInsert: true,            // sets defaults values on insert
                                upsert: true
                            };

                            MerchantModel.findOneAndUpdate({_id: data.merchant_id}, {images_new: gallery}, options, function (err, merchantObj) {

                                if (err) {

                                    console.error(err);

                                    reply({

                                        success: false,
                                        error: err
                                    });


                                }
                                else {

                                    console.log('Merchant logo modified successfully');

                                    reply({
                                        success: merchantObj != null,//? false : true,
                                        data: {
                                            merchant: merchantObj
                                        }
                                    });
                                }
                            });
                        }
                    });

                }, 1);

            }

            console.log('Execution reached out of main block');
        }
    },

    deleteMerchant: function (request, reply) {

        setTimeout(function () {

            async();

        }, 1);

        var async = function () {

            MerchantModel.findByIdAndRemove(request.payload.merchant_id, function (err, deletedObject) {

                if (err) {

                    reply({

                        success: false,
                        error: err,
                        message: 'Delete Opration Failed'
                    }).code(400);

                    console.error("ERROR : DELETE MERCHANT :", err)
                }
                else {

                    console.log(deletedObject);

                    if (deletedObject) {

                        reply({

                            success: true,
                            data: {
                                merchant_id: deletedObject._id
                            },
                            message: 'Merchant deleted Successfully'
                        });
                    }
                    else {

                        reply({

                            success: false,
                            message: 'Delete operation failed.May be there isn\'t any matching merchant Or some other ' +
                            'error could have taken place.',
                            error: {}
                        }).code(400);
                    }


                }
            });

        };

        console.log('End of main func body');
    },

    modifyMerchant: function (request, reply) {

        // define Async task to run in sec thread to keep I/O open

        setTimeout(function () {

            async();

        }, 1);

        var async = function () {

            //  update the merchant referred in Params

            const requestData = request.payload;
            const merchantID = request.params.merchant_id;

            console.log(requestData);
            console.log(merchantID);

            let options = {
                new: true,                         // returns new modified object
                setDefaultsOnInsert: true            // sets defaults values on insert
            };


            MerchantModel.findOneAndUpdate({_id: merchantID}, {$set: requestData}, options, function (err, result) {

                if (err) {

                    console.error('error occurred updating merchant :' + err);

                    reply({

                        success: false,
                        error: err,
                        message: 'Merchant updation failed.'
                    }).code(400);

                }
                else {

                    if (result) {

                        reply({

                            success: true,
                            data: result,
                            message: 'Merchant updated successfully'
                        });
                    }
                    else {

                        reply({

                            success: true,
                            data: null,
                            message: 'Update operation failed.No matching Merchant data found to update.'
                        }).code(404);
                    }


                }
            });


        }

        console.log('execution reachd out of main block');

    },

    upsertGalleryImage: function (request, reply) {

        setTimeout(function () {

            asyncFunc();

        }, 1);

        var asyncFunc = function () {

            // validate payload for pre-requisites

            // console.log(request.payload);

            console.log(request.payload.path == null);

            let isInsert = request.payload.path == null;// checks whether the operation is -- INSERT or UPDATE

            console.log('operation : INSERT :' + isInsert == true);

            let merchant = null;

            // get the valid merchant object referred from Payload

            MerchantModel.find({_id: request.params.merchant_id}, {_id: 1, images_new: 1}, null, function (err, docs) {

                if (docs != null && docs != undefined && docs.length > 0) {

                    console.log('found valid merchant as :\n', docs);

                    // find the path object referred from Payload

                    merchant = docs[0];

                    let gallery = merchant.images_new;

                    console.log(gallery);

                    if (gallery != undefined && gallery != null) {

                        saveImage(gallery);

                    }

                }
                else {

                    if (err != null) {


                        return sendErrorReply(err, 'Error occurred updating merchant gallery image', 404, reply);
                    }
                    else {

                        return sendErrorReply('Error occurred updating merchant gallery image', BLErrors.MERCHANT_NOT_FOUND, 404, reply);
                    }
                }


            });


            // now save the image to specified Path

            var saveImage = function (gallery) {

                // build the filename, filePath and save new image using incoming stream

                var data = request.payload;

                if (data.image_gallery && data.image_gallery.size !== 0) {

                    // gallery.curr_index++;

                    var extension, filename, name, filename = null;

                    var isExtensionDiffer = false;


                    // New code starts

                    gallery.curr_index = isInsert == true ? gallery.curr_index + 1 : gallery.curr_index;

                    let pathIndex = -99;

                    let aPath = null;

                    if (isInsert == false) {

                        if (data.path != undefined && data.path != null) {

                            let arrPaths = gallery.paths;

                            let filteredPaths = arrPaths.filter(function (element, index) {

                                console.log(element.id,'----',element.uri === data.path.uri);
                                console.log(index);

                                if (element.id === data.path.id && element.uri === data.path.uri) {

                                    pathIndex = index;
                                    return element;
                                }
                            });

                            if (filteredPaths.length == 0) {

                                return sendErrorReply('Error updating merchant gallery image', BLErrors.GALLERY_PATH_NOT_FOUND, 404, reply);
                            }
                            else {

                                aPath = filteredPaths[0];
                            }
                        }

                        var newExtension = Path.extname(data.image_gallery.hapi.filename).toLowerCase();

                        var extension = Path.extname(data.path.uri).toLowerCase();

                        filename = Path.basename(data.path.uri).replace(extension, newExtension);

                        // New code to append timestamp at the end of filename

                        let timestamp = Date.now().toString();

                        let onlyFileName = filename.replace('.' + newExtension, '');

                        var arrComponents = onlyFileName.split("_");

                        if (arrComponents.length == 3) {

                            arrComponents[2] = timestamp;
                        }
                        else if (arrComponents.length == 2) {

                            arrComponents.push(timestamp);
                        }

                        let newFileName = arrComponents.join('_').toString() + newExtension;

                        console.log(newFileName);

                        filename = newFileName;

                        // New code ends

                        console.log('modify operation');

                        console.log(newExtension);
                        console.log(extension);

                        if (( newExtension === extension ) == true) {

                            isExtensionDiffer = false;
                        }
                        else {

                            isExtensionDiffer = true;
                        }

                        console.log('modify opertaion filename');
                        console.log(filename);

                    }
                    else {
                        // New code ends


                        name = data.image_gallery.hapi.filename;

                        extension = Path.extname(name);

                        //filename = request.payload.merchant_id + '_' + gallery.curr_index + extension;

                        // New code to append timestamp at the end of filename

                        let timestamp = Date.now().toString();

                        filename = request.params.merchant_id + '_' + gallery.curr_index + '_' + timestamp + extension;

                        console.log('inserting new image  with file name : ', filename);
                        // New code ends

                    }// New code line

                    let directory = 'Media/Images/Merchants/' + request.params.merchant_id + '/';

                    helpers_generic.checkORCreateDirectory(directory, '0777', function (err) {

                        if (err) {

                            console.error(err);

                            //return reply({
                            //
                            //    success: false,
                            //    error: err
                            //});

                            return sendErrorReply(err, 'Error occurred updating merchant gallery image', 404,reply);

                        }

                    });

                    let path = directory + filename;

                    //let uri = '/public/images/' + request.payload.merchant_id + '/';

                    let uri = '/public/images/Merchants/' + request.params.merchant_id + '/';

                    let deletePath = null;

                    if (isInsert == false) {

                        //deletePath = data.path.uri.replace("/public/images/","./Media/Images/Merchants/");

                        deletePath = data.path.uri.replace("/public/images/", "./Media/Images/");
                    }

                    helpers_generic.saveImageToPath(data.image_gallery, filename, path, uri, function (err, message, result) {

                        console.log('inside [saveImageToPath] callback function');
                        console.log('message : ' + message);
                        console.log('error : ' + err);

                        console.log('sending Reply to client');

                        if (result != null) {

                            console.log(result);

                            console.log(request.params.merchant_id);//console.log(data.merchant_id);

                            if (isInsert == true) {

                                gallery.paths.push({

                                    id: gallery.curr_index,
                                    uri: result.url
                                });
                            }
                            else {

                                /*
                                 let aPosition = -99;

                                 var aFilter =  function(currValue, index, arr){

                                 console.log(currValue);
                                 console.log(index);
                                 console.log(arr);
                                 console.log(data.path.id);


                                 if( data.path.id == currValue.id){

                                 console.log('match found at index :'+ index);
                                 aPosition = index;
                                 return index;
                                 }
                                 };
                                 */


                                //let aPath = gallery.paths.find(aFilter);

                                //let aPath = filte

                                console.log('Path found  :' + aPath);

                                if (aPath != null && aPath != undefined && pathIndex >= 0) {

                                    aPath.uri = result.url;//filename;
                                    gallery.paths[pathIndex] = aPath;//request.payload.path;
                                    //gallery.paths[index].uri = filename;
                                }

                            }

                            ////
                            let options = {

                                new: true,                         // returns new modified object
                                setDefaultsOnInsert: true,            // sets defaults values on insert
                                upsert: true,
                                projection  :   {_id : 1, images_new : 1}
                            };

                            console.log('new gallery : ' + gallery);

                            //console.log('menu data : ' + merchant.menuData);

                            //MerchantModel.findOneAndUpdate({_id: request.params.merchant_id}, {$set: {images_new: gallery}}, options, function (err, merchant) {

                            //MerchantModel.findOneAndUpdate({_id: data.merchant_id}, {$set: {images_new: gallery}}, options, function (err, merchant) {

                            merchant.images_new =   gallery;

                            merchant.save(function (err, merchant, numRowsAffected) {

                                if (err || numRowsAffected == 0) {

                                    console.error(err);

                                    return sendErrorReply(err, 'Error updating merchant gallery image', 400, reply);


                                }
                                else if(merchant) {

                                    console.log('Merchant Gallery modified successfully');

                                    var output = merchant//.toObject();

                                    let pathRequired    =   isInsert == true ? output.images_new.paths.pop() : aPath;

                                    let newPath =   [pathRequired];

                                    output.images_new.paths =  newPath;//[]

                                    //output.images_new.paths.push(pathRequired);

                                    console.log(output.images_new);


                                    reply({
                                        success: merchant != null,//? false : true,
                                        //data: {
                                        data: output.toObject(),//merchant.toObject(),
                                        //}
                                        message :  'Merchant gallery image ' + ( isInsert == true ? 'inserted successfully' : 'modified successfully')
                                    });


                                    if (isInsert == false)// && isExtensionDiffer == true){

                                        setTimeout(function () {

                                            console.log('Attempting to delete file at path : ' + deletePath);

                                            helpers_generic.deleteFile(deletePath, function (err) {

                                                if (err) {

                                                    console.log('problem deleting file at path' + deletePath + '\n Error : ' + err);
                                                }
                                                else {

                                                    console.log('successfully deleted file at path' + deletePath);
                                                }
                                            });

                                        }, 1);
                                }
                                else{

                                    return sendErrorReply("Unknown Server Error occurred","Error updating Merchant\'s gallery", 404, reply);
                                }


                            });

                            ////

                            console.log('Image received and updated successfully.');

                        }


                    });
                }
                else {

                    return sendErrorReply('Error occurred updating merchant gallery image', BLErrors.FILE_SIZE_ZERO, 400, reply)
                }

            };

        }
    },

    removeGalleryImage :  function(request, reply) {

        setTimeout(function () {

            asyncFunc();

        }, 1);

        var asyncFunc = function () {

            // validate payload for pre-requisites

            let merchant = null;

            let data = request.payload;

            // get the valid merchant object referred from Payload

            MerchantModel.find({_id : request.params.merchant_id},{_id : 1, images_new : 1},null, function(err, docs){

                if(docs != null && docs != undefined && docs.length == 1){

                    console.log('found valid merchant as :\n', docs);

                    // find the path object referred from Payload

                    merchant = docs[0];

                    let gallery = merchant.images_new;

                    //  verifying the Existence of Image Path supplied in payload

                    var pathIndex   =   -99;

                    var aPath       =   null;

                    if( data.path != undefined && data.path != null){

                        let arrPaths    =   gallery.paths;

                        let filteredPaths   =   arrPaths.filter(function(element, index){

                            console.log(element.id, '---', element.id === data.path.id , '<--->', element.uri === data.path.uri);

                            if(element.id === data.path.id && element.uri === data.path.uri) {

                                pathIndex   =   index;
                                return element;
                            }
                        });

                        if(filteredPaths.length == 0){

                            return sendErrorReply( 'Error deleting merchant gallery image',BLErrors.GALLERY_PATH_NOT_FOUND,404,reply);
                        }
                        else{

                            aPath   =   filteredPaths[0];
                        }
                    }
                    //
                    console.log(gallery);

                    deleteImage(gallery, pathIndex, aPath);

                }
                else{

                    if(docs.length > 1){

                        return sendErrorReply('Error occurred deleting merchant gallery image', BLErrors.MERCHANT_DUPLICATE_FOUND , 404,reply);
                    }
                    else if(err != null){

                        return sendErrorReply(err, 'Error occurred deleting merchant gallery image', 404,reply);
                    }
                    else{

                        return sendErrorReply('Error occurred deleting merchant gallery image', BLErrors.MERCHANT_NOT_FOUND,404,reply);
                    }
                }

            });

            var deleteImage = function (gallery, index, pathObject) {

                //var deletePath = data.path.uri.replace("/public/images/","./Media/Images/Merchants/");

                var deletePath = data.path.uri.replace("/public/images/", "./Media/Images/");

                setTimeout(function () {

                    console.log('Attempting to delete file at path : ' + deletePath);

                    helpers_generic.deleteFile(deletePath, function (err) {

                        if (err) {

                            console.log('problem deleting file at path' + data.path + '\n Error : ' + err);

                            return sendErrorReply(err,'Error occurred deleting merchant gallery image', 404, reply);
                        }
                        else {

                            console.log('successfully deleted file at path' + data.path);

                            /*
                             let newPaths = [];

                             newPaths = gallery.paths.filter(function (el) {

                             console.log('is same path object :', el.id === data.path.id);

                             return el.id !== data.path.id
                             });

                             gallery.paths = newPaths;
                             */

                            gallery.paths.splice(index,1);

                            console.log('new gallery paths:' + gallery.paths);
                            console.log('new gallery paths:' + gallery.paths.length);

                            if (gallery.paths.length == 0) {

                                gallery.curr_index = -1;
                            }

                            merchant.images_new =   gallery;

                            merchant.save(function(err, modMerchant,numRowsAffected){

                                if(modMerchant != undefined && modMerchant != null){

                                    //console.log(modMerchant);

                                    var output =   modMerchant.toObject();

                                    output.path    =   pathObject.toObject(),
                                        output.path.deleted =   true
                                    delete output.images_new;

                                    return reply({
                                        success     :   true,
                                        data        :   output,
                                        message     :   'Gallery Image was successfully removed.'
                                    })
                                }
                                else if(err != null && numRowsAffected == 0){

                                    return sendErrorReply(err, 'Error deleting merchant gallery image', 400, reply);
                                }
                                else{

                                    return sendErrorReply('Error deleting merchant gallery image', BLErrors.MERCHANT_NOT_FOUND ,404, reply);
                                }

                            });

                        }
                    });

                }, 1);

            }

        };

        console.log('Execution reached out of main block');
    },

    deleteGallery   :   function(request, reply){

        var asyncFunc   =   function(){

            var deleteImage = function(deletePath, index ,callback){

                callback();
            }

            MerchantModel.findOne({_id  :   request.params.merchant_id},{_id : 1, images_new : 1},null,function(err, doc){

                if(doc != undefined && doc != null){

                    let merchant = doc;

                    if(merchant.images_new.paths.length == 0){

                        return reply({

                            success     :   true,
                            data        :   merchant,
                            message     :   "Merchant Gallery is empty. There is nothing to delete."
                        });
                    }

                    let paths   =   merchant.images_new.paths;
                    let currIndex   =   merchant.images_new.curr_index;

                    var initialCount =  merchant.images_new.paths.length > 0 ? merchant.images_new.paths.length : 1;

                    for(var path = 0; path < merchant.images_new.paths.length; path++){

                        console.log( merchant.images_new.paths[path].uri);

                        let deletePath = merchant.images_new.paths[path].uri.replace("/public/images/", "./Media/Images/");

                        deleteImage(deletePath, path,function(err){

                            let index = path;

                            helpers_generic.deleteFile(deletePath, function (err) {

                                //console.log('index --', index,'Initial count --', initialCount);

                                if(err){

                                    console.log('problem deleting file at path' + deletePath+ '\n Error : ' + err);

                                    if(index == initialCount - 1) { // deletions are done

                                        updateMerchant();
                                    }
                                }
                                else{

                                    //console.log(index);

                                    paths.splice(0,1);

                                    //console.log('deleted file at path' + deletePath + 'paths count :', paths.length);

                                    if(index == initialCount - 1){ // deletions are done

                                        merchant.images_new.paths   =   paths;

                                        //console.log(paths);

                                        if(paths.length == 0){

                                            currIndex = -1;

                                            merchant.images_new.curr_index  =   currIndex;
                                        }

                                        updateMerchant();

                                    }

                                }
                            });
                        });

                    }

                    var updateMerchant  =   function(){

                        console.log('inside updateMerchant');

                        merchant.save(function(err, modMerchant,numRowsAffected){

                            if(modMerchant != undefined && modMerchant != null){

                                return reply({
                                    success     :   true,
                                    data        :   modMerchant,
                                    message     :   'Gallery was removed successfully.'
                                })
                            }
                            else if(err != null && numRowsAffected == 0){

                                return sendErrorReply(err, 'Error deleting merchant gallery', 400, reply);
                            }
                            else{

                                return sendErrorReply('Error deleting merchant gallery', BLErrors.MERCHANT_NOT_FOUND ,404, reply);
                            }

                        });
                    }

                    console.log('loop completed');

                }
                else if(err != null){

                    return sendErrorReply(err, 'Error occurred deleting merchant gallery', 400, reply);
                }
                else{

                    return sendErrorReply('Error occurred deleting merchant gallery',BLErrors.MERCHANT_NOT_FOUND , 404, reply);
                }
            });
        };

        execute(asyncFunc);
    },

    searchNearBy    : function (request, reply) {

        var asyncFunc   = function () {

            var limit = request.params.limit || 10;

            // get the max distance or set it to 8 kilometers
            var maxDistance = request.params.radius || 8;

            MerchantModel.geoNear([request.params.longitude, request.params.latitude],
                { maxDistance : maxDistance/6373, spherical : true, distanceMultiplier : 6373 },
                function(err, docs, statistics){

                    console.log( statistics);

                    if(docs && docs.length > 0){

                        let output  =   docs.map(function(element){

                            return {

                                // merchant    :   {
                                merchant_id     :   element.obj._id,
                                name            :   element.obj.name,
                                vicinity        :   element.obj.vicinity,
                                formatted_address:  element.obj.formatted_address,
                                rating          :   element.obj.rating,
                                icon            :   element.obj.icon,
                                website         :   element.obj.website,
                                geo         :   {
                                    distance    :   parseFloat(element.dis.toPrecision(5)),
                                    location    :   element.obj.geometry.location
                                },
                                open_now        :   element.obj.open_now

                                // }
                            }
                        });

                        // console.log(output);

                        reply({

                            success     :   true,
                            data        :   output,//docs,
                            message     :   'Successfully retrieved nearby merchants'
                        });
                    }
                    else if (err) {

                        console.error(err);
                        return sendErrorReply(err, 'Error occurred getting nearby merchants', 400,reply);
                    }
                    else if(!docs || docs.length == 0){

                        //return sendErrorReply('Error occurred getting nearby merchants', 'No Merchant found around.',404,reply);

                        reply({

                            success     :   true,
                            data        :   [],//docs,
                            message     :   'No Merchant found around.'
                        });
                    }

                });


            //var limit = request.params.limit || 10;
            //
            //// get the max distance or set it to 8 kilometers
            //var maxDistance = request.params.radius || 8;

            // we need to convert the distance to radians
            // the raduis of Earth is approximately 6371 kilometers
            //maxDistance /= 6371;
            //
            //console.log("max distance radians :", maxDistance);
            //
            //// get coordinates [ <longitude> , <latitude> ]
            //var coords = [];
            //coords[0] = request.params.longitude;
            //coords[1] = request.params.latitude;

            // find a location
            //MerchantModel.find({
            //    locSearch: {
            //        $near: coords,
            //        $maxDistance:maxDistance,
            //        //$spherical: true
            //    }
            //})
            //    .select('_id name hasLoyaltyScheme formatted_address formatted_phone_number ' +
            //    'international_phone_number icon opening_hours icon geometry')
            //    .limit(limit).exec(function(err, docs) {
            //
            //    if(docs && docs.length > 0){
            //
            //        return reply({
            //
            //            success     :   true,
            //            data        :   docs,
            //            message     :   'Successfully retrieved nearby merchants'
            //        });
            //    }
            //    else if (err) {
            //
            //        return sendErrorReply(err, 'Error occurred getting nearby merchants', 400,reply);
            //    }
            //    else{
            //
            //        return sendErrorReply('Error occurred getting nearby merchants', 'No Merchant found around.',404,reply);
            //    }
            //
            //
            //});
        }

        execute(asyncFunc);


    },

    getStatistics   :   function(request, reply){

        var asyncFunc   =   function(){

            let req =    request;

            let time_range     =   req.payload.time_range;

            console.log("inside get Merchant Statistics Function :  \ncredentials : ", req.auth.credentials,"\n scope :", req.params.scope);

            let authUser = req.auth.credentials ? req.auth.credentials.member : null;//helpers_generic.getCurrentAuthUser();

            //console.log("GET ALL ORDERS : Curr auth user from credentials : ", authUser);

            console.log(authUser.merchants[0] === req.params.merchant_id)

            console.log(authUser.merchants[0]);

            console.log(req.params.merchant_id);

            if (authUser.role === 'admin' && (authUser.merchants[0].toString() === req.params.merchant_id.toString())){

                console.log("requested Date range is : ", time_range);

                //var start = new Date(2010, 11, 1);
                //var end = new Date(2010, 11, 30);
                let rangeQuery  =   {$gte: ['checkoutTime',time_range.from], $lt: ['checkoutTime',time_range.to]};

                OrderModel.aggregate([
                    {
                        $match  :   {
                            'merchant.merchant_id'   :   authUser.merchants[0],
                            checkoutTime   :    {$gte   :    time_range.from, $lt : time_range.to}
                        }
                    },
                    {

                        $group  :   {
                            _id : {
                                month: { $month: "$checkoutTime" },
                                day: { $dayOfMonth: "$checkoutTime" },
                                year: { $year: "$checkoutTime" },
                                week: {$week    :   "$checkoutTime"},
                                //hour: { $hour: "$checkoutTime" },
                                'merchant.merchant_id' : authUser.merchants[0],
                            },
                            totalRevenue    :   {$sum : '$cost.finalCost'},
                            totalOrders     :   {$sum : 1},
                            totalRatings    :   {$sum : {$ne: ['rating', null]}}//{$sum : {'rating' : {$ne:null}}}
                        }
                    }
                ], function(err, result){

                    console.log("Statistics result : ", result);
                    console.error("Statistics error : ", err);


                    var merchant_id =   authUser.merchants[0];

                    if(result){

                        let arrStats    =   result.map(function(element, index){

                            let output  =   {
                                timeline    :   {
                                    month   :   element._id.month,
                                    year    :   element._id.year,
                                    day     :   element._id.day,
                                    week    :   element._id.week
                                },
                                count       :   {
                                    revenue     :   element.totalRevenue,
                                    orders      :   element.totalOrders,
                                    ratings     :   element.totalRatings
                                }
                            };
                            return output;
                        });

                        reply({

                            success     :   true,
                            data       :   {
                                merchant_id :   merchant_id,
                                stats       :   arrStats
                            },
                            message     :   "Merchant\'s statistics retrieved successfully"
                        });
                    }
                    else{

                        reply({

                            success     :   false,
                            error       :   err,
                            message     :   "Merchant\'s statistics retrieval failed"
                        });
                    }
                });

            }
            else{

                return sendErrorReply("Invalid member access detected","Client requesting this resource is not authorized",404, reply);

            }
        }

        execute(asyncFunc);
    }

}





