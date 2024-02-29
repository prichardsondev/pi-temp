const express = require('express');

const customCors = require('./cors');
const app = express();
app.options("*", customCors);
app.use(customCors);

const sensor = require("node-dht-sensor");

//landing page
app.get('/', (req,res) => {res.send("Head to /temp")});

//endpoint to get current temp
app.get('/temp', (req, res, next) => {
  sensor.read(11, 4, async (error, celsius, humidity) => {
    if (!error) {
        let data = {'Humidity':humidity};
        if(req.query.format === 'f'){
            data = {...data, 'Fahrenheit': (celsius * 1.8) + 32};
        } else data = {...data, 'Celsius': celsius};
        res.status(200).json({ 'status': 'success', data });
    } else {
        const err = new Error(error.message);
        err.status = 'fail';
        err.statusCode = 404;
        //skip all other middleware and run global error handler
        next(err);
    }
  });
});

//all other endpoints not defined
app.all('*', (req,res,next) => {
    const err = new Error(`${req.originalUrl} endpoint not defined`);
    err.status = 'fail';
    err.statusCode = 404;
    //skip all other middleware and run global error handler
    next(err);
});

//global err handling
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    });
});


const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}/`));