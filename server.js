const express = require("express")
const application = express();
const cors = require('cors');
const fileReadObj = require('fs')

// Cross Origin Resource sharing - Allowing request from another website/domain
application.use(cors())

// application.use(express.static("public/"));

// Endpoint to fetch (GET) the all JSON contents
// http://localhost:9999/getAllProductDetails
application.get('/getAllProductDetails', function(req, res)
{
    fileReadObj.readFile(__dirname + "/JSONFiles/" + "ProductDetails.json", 'utf8', function(err, data)
    {
        if(err)
        {
            res.send(err)
        }
        else
        {
            //console.log(data)
            res.send(data); //sending the response from endpoint
        }

    });
}
)

// Endpoint to fetch (GET) specific product details by its name
// http://localhost:9999/getProductDetailsById/1

application.get('/getProductDetailsById/:productId',function(req,res)
    {
        fileReadObj.readFile(__dirname + "/JSONFiles/" + "ProductDetails.json",function(err,data)
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    var products = JSON.parse(data);
                    var fetchedProduct = products["product"+req.params.productId] //forming "product1"
                    console.log(fetchedProduct)
                    res.send(fetchedProduct)
                }
            }
        )
    }
)

// Endpoint to fetch (GET) available product colours - by giving productname as input
// http://localhost:9999/getAvailableProductColours/Girls T-shirt
// http://localhost:9999/getAvailableProductColours/JBL Wireless Earphones

application.get("/getAvailableProductColours/:productName",function(req,res)
    {
        fileReadObj.readFile(__dirname + "/JSONFiles/" + "ProductDetails.json",function(err,data)
        {
            if(err)
            {

            }
            else
            {
                var products = JSON.parse(data); // This will return a JAVASCRIPT Array
                console.log("Endpoint called");
                var length = Object.keys(products).length;
                console.log(length)

                for(i=0;i<length;i++)
                {
                    var incrementedI = i+1
                    var appendName = "product"+incrementedI.toString()
                    console.log(appendName)
                    if(req.params.productName == products[appendName].productName)
                    {
                        res.send("The available colours are "+ products[appendName].productColour)
                    }
                }
            }
        }
        )
    }
)

// Endpoint to fetch (GET) available product sizes - by giving productname as input

// Endpoint (POST) to insert a new product into JSON

// Endpoint to remove a product (DELETE)- by giving productname as input


// Setting the local server port number.
application.listen(9999), function ()
{
    console.log("Server listening at the port 9999.............")
}

