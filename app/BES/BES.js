var FIREBASE_URL = 'https://beacon-event-sim.firebaseio.com/';



/**
By seconds stayed in proximity with a beacon before leaving, calculate number of "didRangeBeacons" and "didExitRegion" events to emit

seconds_stayed : seconds stayed in proximity with a beacon before leaving

return : a json specifying number of "didRangeBeacons" and "didExitRegion" should be emitted
*/
function calculateNumberOfRangeEventToSend(seconds_stayed){

    var t = seconds_stayed;

    if (t <= 0) {
        return {"didRangeBeacons": 0, "didExitRegion": 0};
    }else if(t > 0 && t < 2){
        return {"didRangeBeacons": 1, "didExitRegion": 1};
    }else if(t >= 2 && t < 3){
        return {"didRangeBeacons": 2, "didExitRegion": 1};
    }else if(t >= 3 && t < 4){
        return {"didRangeBeacons": 3, "didExitRegion": 1};
    }else if(t >= 4 && t < 5){
        return {"didRangeBeacons": 4, "didExitRegion": 1};
    }else{ // t>= 5
        return {"didRangeBeacons": 5, "didExitRegion": 1};
    }

}

/**
Process simulation seed to generate each beacon event, and pass each beacon event to user-defined handler

json : the simulation seed that specify what beacon events to generate
beacon_event_handler : function with signature "function(beacon_event)", get called when a beacon event is available

return : nothing
*/
function processSimulationSeed(json, beacon_event_handler){

    var beacons = json["setup"]["beacons"];
    var mobiles = json["setup"]["mobiles"];

    var beacon_mobile_events = json["events_between"];

    _.each( _.keys(beacon_mobile_events), function(beacon_alias){

        var beacon = beacons[beacon_alias];
        var mobile_events = beacon_mobile_events[beacon_alias];

        _.each( _.keys(mobile_events), function(mobile_alias){

            var mobile = mobiles[mobile_alias];
            var events = mobile_events[mobile_alias];

            _.each( events, function(event){

                var seconds_stayed = event["seconds_stayed"];
                var start_time = event["start_time"];
                var major = beacon["major"];
                var minor = beacon["minor"];
                var uuid = beacon["uuid"];
                var visitor_uuid = mobile["uuid"];

                var start_time_ms = Date.parse(start_time);
                var number_of_events_to_send = calculateNumberOfRangeEventToSend(seconds_stayed);

                var one_second_in_ms = 1000;

                for (var i = 0; i < number_of_events_to_send["didRangeBeacons"]; i++) {
                    var created_at = new Date (start_time_ms + i * one_second_in_ms);
                    var beacon_event = {
                        "type" : "didRangeBeacons",
                        "minor" : minor,
                        "major" : major,
                        "uuid" : uuid,
                        "visitor_uuid" : visitor_uuid,
                        "created_at" : created_at.toString()
                    };
                    beacon_event_handler(beacon_event);
                };

                if (number_of_events_to_send["didExitRegion"] > 0) {
                    var created_at = new Date (start_time_ms + seconds_stayed * one_second_in_ms);
                    var beacon_event = {
                        "type" : "didExitRegion",
                        "minor" : minor,
                        "major" : major,
                        "uuid" : uuid,
                        "visitor_uuid" : visitor_uuid,
                        "created_at" : created_at.toString()
                    };
                    beacon_event_handler(beacon_event);
                };




            } );

        } );

    } );

}







if (Meteor.isClient) {

    var firebase = new Firebase(FIREBASE_URL);


    Template.normal.events({

        'click input#upload': function(){

            var message = $('pre#message');
            var content = $('pre#json_content');

            var file = $('input#json')[0].files[0];

            message.text('');
            content.text('');

            $('div#message, div#seed_content').hide();
            $('div#message').fadeIn(300);
            

            if(file){
                var reader = new FileReader();
                
                reader.onload = function(e){
                    try{

                        var json_text = e.target.result;
                        var json = $.parseJSON(json_text);
                        message.text('Simulation seed upload success\nStart generating beacon events...\n\n');
                        content.text( JSON.stringify(json, null, 4) );
                        console.log(json);

                        var firebase_upload_log = '';

                        processSimulationSeed(json, function(beacon_event){ 
                            firebase.push(beacon_event);
                            firebase_upload_log += '****Sent Beacon Event:\n';
                            firebase_upload_log += JSON.stringify(beacon_event, null, 4);
                            firebase_upload_log += '\n\n';
                        });

                        message.text( message.text() + firebase_upload_log );
                        $('div#seed_content').fadeIn(300);

                    }catch(ex){
                        //message.text('Error: potentially invalid JSON \n(Please check if it is malformed JSON, eg. key is not included by double quotation mark, like {test: 1} or {\'test\': 1})');
                        message.text(ex.message);
                        console.error(ex);
                    }
                };

                reader.onerror = function(e){
                    //message.text('Error: upload error');
                    message.text(e.message);
                    console.error(e);
                };

                reader.readAsText(file, "UTF8");

            }else{
                message.text('No file selected');
            }
        }

    });

}








if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        var fs = Npm.require('fs');
        var path = process.env.JSON_PATH;

        if(path){

            console.log('##############START UP PARAMETER DETECTED############\n\nReading '+path+'\n');

            fs.readFile(path, 'utf8', function(err,data){ 

                if (err) {

                   console.error(err);

                }else{

                    try{

                        var json = JSON.parse(data);
                        
                        //Use the firebase from NPM
                        var firebase_npm = new Firebase(FIREBASE_URL);

                        processSimulationSeed(json, function(beacon_event){
                            firebase_npm.push().set(beacon_event);
                            console.log('****Sent Beacon Event:');
                            console.log( JSON.stringify(beacon_event, null, 4), '\n');
                        } );

                    }catch(ex){
                        console.error(ex);
                    }

                }

            });

        }

    });
}
