const express = require("express")
const application = express();

// Setting the local server port number.
application.listen(9999), function ()
{
    console.log("Server listening at the port 9999.............")
}