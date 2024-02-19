import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './src/util/util.js';
import {router as imageRoutes} from './src/routes/imageRoutes.js'

// used to configure environment variables
const denv = dotenv.config();

const app = express(); 

  
//default port to listen
const port = process.env.PORT || 8082;

app.use(bodyParser.json());

  
// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1
  
// Root Endpoint
// Displays a simple message to the user
app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
} );
  
app.use(imageRoutes);

// Start the Server
app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
} );
