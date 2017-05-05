module.exports = function(app, passport) {
        
var mongoose = require('mongoose');

var User = require('./models/user');

var Telemetry = require('./models/telemetry');

var Config = require('./models/configuration');

var ProxyStatus = require('./models/proxystatus');

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('login.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // DASHBOARD SECTION =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {
        
        res.render('dashboard.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/dashboard',
            failureRedirect : '/'
        }));

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/dashboard',
            failureRedirect : '/'
        }));

    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/dashboard');
        });
    });


    // -------------------Save and Load Grid Layout ---------------------------------

    //Load Layout from User collection of Quindar database
    app.get('/loadLayout', function(req,res){
        var email = req.query.email;

        //Load the layout from the User collection
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            res.send(user.grid);
        });
    });
  
    //Save Layout to User collection of Quindar database
    app.post('/saveLayout',function(req,res){
        var email = req.body.email;
        var dashboard = req.body.dashboard;
        var count = 0;

        //Insert the layout into the user collection
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            //Check if there are layouts stored
            if(user.grid.length != 0){
                for(var i=0; i<user.grid.length; i++){
                    if(dashboard.name == user.grid[i].name){
                        user.grid[i] = dashboard;
                        count ++;
                    }
                }
                //If the new name does not exist in the layout, push the new layout
                if(count == 0){
                    user.grid.push(dashboard);
                }
            } else {
                user.grid.push(dashboard);
            }
            user.markModified('grid');
            user.save(function(err) {
                if (err) throw err;
                
                res.send(user);
            });
        });

    });

    //Get telemetry data for the array of vehicles passed as a parameter
    app.get('/getTelemetry', function(req, res){
        var vehicles = req.query.vehicles;
        var telemetry = {};

        if(vehicles) {
            Telemetry.find( 
                {'vehicleId.value' : { $in: vehicles} }, 
                {}, 
                { sort: { '_id' : -1 }, limit : vehicles.length },
                function(err, result) {
                    if(err) throw err;

                    for(var i=0; i<result.length; i++) {
                        telemetry[result[i].vehicleId.value] = result[i];
                    }
                    res.send(telemetry);
                }
            );
        }
    });

    //Get Configuration contents for the source name passed as a parameter
    app.get('/getConfig', function(req, res){
        var source = req.query.source;
        var contents;
        var flags = [];
        var configuration = [];

        Config.findOne({ 'source.name' : source }, { '_id': 0 }, function(err, config) {
            if(err){
                console.log(err);
            }

            for (var item in config.contents){   
                if(config.contents[item].category != "ground station" && 
                    config.contents[item].category != "vehicle") {

                    var category = config.contents[item].category;

                    if( flags[category]) {
                        for(var j=0; j<configuration.length; j++){
                            if(configuration[j].category == category){
                                configuration[j].values.push(item);
                            }
                        }
                    } else {
                        contents = {category:"", values:[]};
                        contents.category = category;
                        contents.values.push(item);
                        flags[category] = true;
                        configuration.push(contents);
                    }
                }
            }
            res.send(configuration);
        });
    });

    //Get Proxy Status
    app.get('/getProxyStatus', function(req, res){
        ProxyStatus.findOne({},{ '_id': 0 ,'__v':0}).sort({_id:-1}).exec(function(err,doc){
            if(err){
                console.log(err);
            }
            res.send(doc);
        });
    }); 
   
};
   
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log("loggedddd");
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
