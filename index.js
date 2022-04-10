const express = require("express")
const application = express();
const cors = require('cors');

// Cross Origin Resourse sharing - Allowing request from another website/domain
application.use(cors())
application.use(express.static("public/"));
// Setting the local server port number.
application.listen(9999), function ()
{
    console.log("Server listening at the port 9999.............")
}
