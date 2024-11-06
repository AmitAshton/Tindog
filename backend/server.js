require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const {logger, logEvents} = require('./middleware/logger') 
const PORT = process.env.PORT

//connecting to the mongoose database
connectDB();

//logger middleware
app.use(logger)

//cors middleware
app.use(cors(corsOptions))

//Let the app strinigy and parse json
app.use(express.json())

//cookie parser middleware
app.use(cookieParser())

//telling the express web server where to look for static files
app.use("/", express.static(path.join(__dirname, "public")))

//https routes handlers
app.use("/", require('./routes/root'));
app.use('/auth', require('./routes/authRoutes')) 
app.use('/users', require('./routes/userRoutes')) 
app.use('/dogs', require('./routes/dogRoutes.js'))
app.use('/sellers', require('./routes/sellerRoutes'))
app.use('/givers', require('./routes/giverRoutes'))
app.use('/buyers', require('./routes/buyerRoutes'))
app.use('/adopters', require('./routes/adopterRoutes'))
app.use('/needsitters', require('./routes/needSitterRoutes'))
app.use('/sitters', require('./routes/sitterRoutes'))


//handling all other error path requests
app.all("*", (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views', '404.html')) //if the requests supports html file then send 404 not found file
    } else if(req.accepts('json')){
        res.json({message: "404 Not Found!"}) // send json 404 message
    }else{
        res.type('txt').send('404 Not Found')
    }
})

//error handler middleware
app.use(errorHandler)

//initializing the server side if connected to the database
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>  console.log("Server running on Port", PORT));
})

//logging a database error to the log file
mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(err.no + ":" + err.code + "\t" + err.syscall + "\t" + err.hostname, 'mongoErrLog.log')
})
