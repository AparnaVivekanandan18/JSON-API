const express = require("express")
const application = express();
const cors = require('cors');
const fileReadObj = require('fs')

// Cross Origin Resource sharing - Allowing request from another website/domain
application.use(cors())

// application.use(express.static("public/"));

// creating an endpoint to fetch the JSON contents (
application.get('/getProductDetails', function(req, res)
{
    fileReadObj.readFile(__dirname + "/JSONFiles/" + "ProductDetails.json", 'utf8', function(err, data)
    {
        console.log(data);
        res.send(data); //sending the response from endpoint
    });
})


// Setting the local server port number.
application.listen(9999), function ()
{
    console.log("Server listening at the port 9999.............")
}

