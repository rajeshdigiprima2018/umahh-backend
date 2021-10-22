/**
 * Created by rv2016 on 14/02/17.
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


var helpers_generic = require('../yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../../Models/merchant').MerchantModel;
//var UserModel = require('../../Models/user').UserModel;



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


var addMenuCardImage    =   function(request, reply){

    setTimeout(function(){

        asyncFunc();

    },1);

    var asyncFunc = function(){

        // validate payload for pre-requisites

        console.log(request.payload);

        console.log(request.payload.path ==  null);

        let isInsert = request.payload.path ==  null;// checks whether the opertaion is -- INSERT or UPDATE

        console.log('operation : INSERT :'+ isInsert==true);

        let merchant = null;

        // get the valid merchant object referred from Payload

        MerchantModel.find({_id : request.payload.merchant_id}, function(err, result){

            if(err){

                console.error(err);

                return reply({

                    success : false,
                    error   : err
                });

            }
            else{

                console.log('found valid merchnat as :\n', result);

                // find the path object referred from Payload

                merchant = result[0];

                let gallery = merchant.menuData.images_menucards;//merchant.images_new;

                console.log(gallery);

                saveImage(gallery);


            }
        });


        // now save the image to specified Path

        var saveImage = function(gallery){

            // build the filename, filePath and save new image using incoming stream

            var data = request.payload;

            if (data.image_gallery &&  data.image_gallery.size !== 0) {

                // gallery.curr_index++;

                var extension, filename, name, filename = null;

                var  isExtensionDiffer = false;


                // New code starts


                gallery.curr_index = isInsert == true ? gallery.curr_index + 1 : gallery.curr_index;

                if(isInsert == false){

                    var newExtension  = Path.extname(data.image_gallery.hapi.filename);

                    var extension =  Path.extname(data.path.uri);

                    filename = Path.basename(data.path.uri).replace(extension, newExtension);

                    console.log('modify opertaion');

                    console.log(newExtension);
                    console.log(extension);

                    if(( newExtension === extension ) == true) {

                        isExtensionDiffer = false;
                    }
                    else{

                        isExtensionDiffer  = true;
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

                let directory = '/Media/Images/Merchants/'+ request.payload.merchant_id +'/MenuCards/';

                helpers_generic.checkORCreateDirectory(directory,'0777',function(err){

                    if(err){

                        console.error(err);

                        return reply({

                            success : false,
                            error   : err
                        });

                    }

                });

                let path = directory + filename;

                let uri = '/public/images/' + request.payload.merchant_id + '/MenuCards/';

                let deletePath = null;

                if(isInsert == false){

                    deletePath = data.path.uri.replace("/public/images/","./Media/Images/Merchants/");
                }


                helpers_generic.saveImageToPath(data.image_gallery,filename, path, uri, function(err,message,result) {

                    console.log('inside [saveImageToPath] callback function');
                    console.log('message : ' + message);
                    console.log('error : ' + err);

                    console.log('sending Reply to client');

                    if (result != null) {

                        console.log(result);

                        console.log(data.merchant_id);

                        if(isInsert == true){

                            gallery.paths.push({

                                id  :   gallery.curr_index,
                                uri :   result.url
                            });
                        }
                        else{
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


                            let aPath = gallery.paths.find(aFilter);

                            console.log('Path found  :'+ aPath);

                            if( aPath != null && aPath != undefined && aPosition >= 0){

                                aPath.uri = result.url;//filename;
                                gallery.paths[aPosition] = aPath;//request.payload.path;
                                //gallery.paths[index].uri = filename;
                            }

                        }

                        ////
                        let options = {

                            new :    true,                         // returns new modified object
                            setDefaultsOnInsert :   true,            // sets defaults values on insert
                            upsert  :   true
                        };

                        console.log('new gallery : ' + gallery);

                        console.log('menu data : ' + merchant.menuData);

                        MerchantModel.findOneAndUpdate({_id: data.merchant_id},{$set : {menuData : {images_menucards: gallery}}}, options , function (err, merchant) {

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




                                if(isInsert == false && isExtensionDiffer == true){

                                    setTimeout(function(){

                                        console.log('Attempting to delete file at path : ' +  deletePath);

                                        helpers_generic.deleteFile(deletePath,function(err){

                                            if(err){

                                                console.log('problem deleting file at path' + data.path +'\n Error : ' + err);
                                            }
                                            else{

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
            else{
                reply({
                    success : false,
                    error   : 'No Image Data received.'
                });
            }

        };

    };

    console.log('control reaches end of main block');
}

