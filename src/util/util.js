import fs from "fs";
import Jimp from "jimp";



// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function  filterImageFromURL(inputURL) {
   console.log('utils::filterImageFromURL URL is: '+inputURL);
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const DOWNLOADED_IMAGE_LOCATION = process.env.LOCATION_OF_DOWNLOADED_IMAGE;
      console.log('utils::filterImageFromURL DOWNLOADED_IMAGE_LOCATION is: '+DOWNLOADED_IMAGE_LOCATION);
      const outpath = DOWNLOADED_IMAGE_LOCATION;
        //"/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
        //"C:\\Users\\topgun\\delete.jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(file) {
  console.log('Inside deleteLocalFiles' +file);

  fs.unlink(file, function(err)  {
    if(err) throw err;

    console.log('File deleted!');
   });
}






