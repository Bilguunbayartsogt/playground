const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const { logEvents, logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 5500; 

app.use(logger);

const whitelist = ['https://www.yahoo.com'];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|index(.html)?', (req, res) => {
    // res.sendFile('./index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/about(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
})

app.get('/old-about(.html)?', (req, res) => {
    res.redirect(301, '/about.html');
})

app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello World');
})



app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'pages', '404.html'));
    } else if (req.accepts('json')) {
        res.json({error: "404 not found"});
    } else {
        res.type('txt').send('404 not found');
    }
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
}); 
