const express = require("express")
const application = express();
const cors = require('cors');

// Setting the local server port number.
application.listen(9999), function ()
{
    console.log("Server listening at the port 9999.............")
}
// Cross Origin Resourse sharing - Allowing request from another website/domain
application.use(cors())