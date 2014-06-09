if (Meteor.isClient) {

    var firebase = new Firebase('https://beacon-event-sim.firebaseio.com/');
    function processSimulationSeed(json){

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
                        console.log(beacon_event);
                        firebase.push(beacon_event);
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
                        console.log(beacon_event);
                        firebase.push(beacon_event);
                    };




                } );

            } );

        } );

    }

  Template.normal.events({
    'click input#upload': function(){

        var message = $('pre#message');
        var content = $('pre#json_content');

        var file = $('input#json')[0].files[0];

        message.text('');
        content.text('');

        if(file){
            var reader = new FileReader();
            
            reader.onload = function(e){
                try{

                    var json_text = e.target.result;
                    var json = $.parseJSON(json_text);
                    message.text('Upload success');
                    content.text( JSON.stringify(json, null, '    ') );
                    console.log(json);
                    processSimulationSeed(json);

                }catch(ex){
                    message.text('Error: potentially invalid JSON \n(Please check if it is malformed JSON, eg. key is not included by double quotation mark, like {test: 1} or {\'test\': 1})');
                    console.error(ex);
                }
            };

            reader.onerror = function(e){
                message.text('Error: upload error');
                console.error(e);
            };

            reader.readAsText(file, "UTF8");

        }else{
            message.text('Error: no file selected');
        }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
