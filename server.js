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

app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
} );
  
app.use(imageRoutes);

// Start the Server
app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
} );
