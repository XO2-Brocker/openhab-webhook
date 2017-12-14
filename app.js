var bodyParser  = require("body-parser"),
express         = require("express"),
app             = express(),
settings        = require("app-settings"),
request         = require('request');

// app config
app.use(bodyParser.urlencoded({extended: true}));
var openhabHost = settings.OpenHABserver.host;
if(settings.OpenHABserver.host == "localhost") openhabHost = "http://localhost";
const serverString  = openhabHost + ":" + settings.OpenHABserver.port;
const restString    = serverString + "/rest/items/";

// test connection to OpenHAB
request(restString, {timeout: 1500}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Connected to OpenHAB at " + serverString);
    }else{
        console.log("OpenHAB is not running at " + serverString + ". Please make sure the server settings are correct in \"settings.json\"");
    }
});

// webhook route
app.post("/", function(req, res){
    var beaconApp;
    if(req.body.trigger !== undefined){
        beaconApp = "Locative";
    }else if(req.body.entry !== undefined){
        beaconApp = "Geofency";
    }else if(req.body.event_type !== undefined){
        beaconApp = "ProximityEvents";
    }
    
    var presenceItem;
    var presenceCommand;
    switch (beaconApp) {
        case "Locative":
            presenceItem = req.body.id;
            if(req.body.trigger == "enter"){
                presenceCommand = "ON";
            }else if(req.body.trigger == "exit"){
                presenceCommand = "OFF";
            }
            break;
        case "Geofency":
            presenceItem = req.body.name;
            if(req.body.entry == "1"){
                presenceCommand = "ON";
            }else if(req.body.entry == "0"){
                presenceCommand = "OFF";
            }
            break;
        case "ProximityEvents":
            presenceItem = req.body.trigger_name;
            if(req.body.event_type.includes("Enter")){
                presenceCommand = "ON";
            }else if(req.body.event_type.includes("Exit")){
                presenceCommand = "OFF";
            }
            break;
    }
    
    request.post(restString + presenceItem,{body:presenceCommand},function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(beaconApp + " sent '" + presenceCommand + "' to '" + presenceItem + "'");
            res.sendStatus(200);
        }else if(response.statusCode == 404){
            console.log("Item \"" + presenceItem + "\" not found (sent from " + beaconApp + ")");
            res.status(404).send("'" + presenceItem + "' not found in OpenHAB.\n Change the iBeacon name within this app to match the OpenHAB item.");
            //res.sendStatus(404);
        }else{
            console.log('error:', error); // Print the error if one occurred
        }
    });
    
});

//test url
app.get("/", function(req, res){
    res.send("OpenHAB Webhook Server is running");
});

// listener
app.listen(settings.webhookListener.port, function(){
    console.log("Webhook listener started on port " + settings.webhookListener.port);
});