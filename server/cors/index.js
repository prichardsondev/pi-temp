const cors = require('cors');

//modify frontend origin in .env as needed
const corsOptions = {
    origin: "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

module.exports = cors(corsOptions);