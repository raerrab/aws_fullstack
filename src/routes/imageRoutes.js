import express from "express";
import fs from "node:fs";
import uploadImage from "../middleware/uploadImageToS3Middleware.js";
import {filterImageFromURL, deleteLocalFiles} from '../util/util.js';
import axios from "axios"
import dotenv from 'dotenv';

// used to configure environment variables
const denv = dotenv.config(); 

export const router = express.Router();

function uploadFile(fileToUpload) {
    console.log("imageRoutes::uploadFile fileToUpload: "+fileToUpload);
    let buffer = fs.readFileSync(fileToUpload);
    let blob = new Blob([buffer]);
    blob.name = 'delete.jpeg';
 
    var form_data = new FormData();
    

    form_data.append('file', blob, blob.name);

    const POST_TO_URL = process.env.AXIOS_POST_URL;
    console.log('imageRoutes::uploadFile POST_TO_URL: '+POST_TO_URL);

 
    axios.post(POST_TO_URL,form_data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(function (response) {
          console.log('imageRoutes::uploadFile UPLOAD_IMAGE_LOCATION: '+fileToUpload);
          deleteLocalFiles(fileToUpload);
          console.log('imageRoutes::uploadFile success' +response.data);
    })
    .catch(function (error) {
        console.log('imageRoutes::uploadFile UPLOAD_IMAGE_LOCATION : '+fileToUpload);
        deleteLocalFiles(fileToUpload);
        console.log('imageRoutes::uploadFile error' +response.data);
    });
  
  }

  router.post("/filteredImage/upload", uploadImage.single('file'), async (req, res) => {
    console.debug('imageRoutes::filteredImage/upload Post Upload to S3');
    console.debug('imageRoutes::filteredImage/upload file: ' + req.file);
    if(req.file){
        console.debug('imageRoutes::filteredImage/upload File Upload Success. Destination is: '+req.file.location);
        res.status(201).json({url: req.file.location});
    } else {
        console.error('imageRoutes::filteredImage/upload Image S3 Upload Failure', req);
        res.status(500).send('Image upload failed')
    }
});
 
router.get("/filteredImage", async (req, res) => {

    try {
        const url = req.query.image_url;
        console.log('imageRoutes::filteredImage Route url is: ', url);

        const thisUrl = url;
        console.log( 'imageRoutes::filteredImage Route thisUrl is: '+thisUrl );


        fetch(thisUrl)
            .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(blob => 
        {
            blob.name = 'delete.jpeg';
            blob.lastModified = new Date();

            const myFile = new File([blob], 'delete.jpeg', {
                type: blob.type,
            });
            console.log('imageRoutes::filteredImage Route: '+myFile);
            console.log('imageRoutes::filteredImage Route: '+myFile.name); 

            const DOWNLOADED_IMAGE_LOCATION = process.env.LOCATION_OF_DOWNLOADED_IMAGE;
            console.log('imageRoutes::filteredImage Route DOWNLOADED_IMAGE_LOCATION: '+DOWNLOADED_IMAGE_LOCATION);

            new Response(blob).arrayBuffer()
            .then(arrayBuffer =>
                {
                    //fs.writeFileSync('C:\\Users\\topgun\\rajtest.jpg', Buffer.from(arrayBuffer));
                    fs.writeFileSync(DOWNLOADED_IMAGE_LOCATION, Buffer.from(arrayBuffer));

                    const UPLOAD_IMAGE_LOCATION = DOWNLOADED_IMAGE_LOCATION;
                    console.log('imageRoutes::filteredImage Route UPLOAD_IMAGE_LOCATION: '+UPLOAD_IMAGE_LOCATION);
                    uploadFile(UPLOAD_IMAGE_LOCATION);
                });

                return res.status(200).send('Image S3 Upload Success ');
        });

    }
    catch(error){
        console.error("imageRoutes::filteredImage S3 upload error", error)
        return res.status(500).send("Error occured")
    } 
});

function filterAndupload(fileToUpload) {
    console.log('imageRoutes::filterAndupload fileToUpload::'+fileToUpload);
    filterImageFromURL(fileToUpload)
    .then(function (response) {
        const DOWNLOADED_IMAGE_LOCATION = process.env.LOCATION_OF_DOWNLOADED_IMAGE;
        console.log('imageRoutes::filterAndupload DOWNLOADED_IMAGE_LOCATION: '+DOWNLOADED_IMAGE_LOCATION);
        const UPLOAD_IMAGE_LOCATION = DOWNLOADED_IMAGE_LOCATION;
        console.log('imageRoutes::filterAndupload UPLOAD_IMAGE_LOCATION: '+UPLOAD_IMAGE_LOCATION);
        uploadFile(UPLOAD_IMAGE_LOCATION);
    })
};


router.get("/filteredImage_v2", async (req, res) => {
    try {
            console.log('imageRoutes::filteredImage2 Route');

            const url = req.query.image_url;
            console.log( `imageRoutes::filteredImage2 url is:${url}` );

            const thisUrl = url;
            console.log( `imageRoutes::filteredImage2 thisUrl is:`+thisUrl );

            filterAndupload(thisUrl);

            return res.status(200).send('Image S3 Upload Success');
    }
    catch(error){
        console.error("imageRoutes::filteredImage S3 upload error", error)
        return res.status(500).send("Error occured")
    } 

});




