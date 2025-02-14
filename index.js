const cors = require('cors')
const express = require("express");
const app = express();
const PORT = process.env.SERVER_PORT || 8000
const { testSpeedHandler } = require( './api-handlers' )

require('dotenv').config();

app.use(cors({
    origin: '*', // Allow all origins (replace * with your frontend's URL for better security)
  }));

app.get("/", async ( req, res ) => { 

    const speedTestData = await testSpeedHandler()
    res.status( speedTestData.status )
    res.send( speedTestData.data )    
});

app.listen( PORT, () => {

    console.log( `Listening on port ${ PORT }` );
});