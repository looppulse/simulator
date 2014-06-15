Beg = new function(){

    var self = this;


    self.calculateNumberOfRangeEventToSend = function(seconds_stayed){
    /**
    By seconds stayed in proximity with a beacon before leaving, calculate number of "didRangeBeacons" and "didExitRegion" events to emit

    seconds_stayed : seconds stayed in proximity with a beacon before leaving

    return : a json specifying number of "didRangeBeacons" and "didExitRegion" should be emitted
    */

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

    };
    

    self.processSimulationSeed = function(json, beacon_event_handler){
    /**
    Process simulation seed to generate each beacon event, and pass each beacon event to user-defined handler

    json : the simulation seed that specify what beacon events to generate
    beacon_event_handler : function with signature "function(beacon_event)", get called when a beacon event is available

    return : nothing
    */

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
                    var number_of_events_to_send = self.calculateNumberOfRangeEventToSend(seconds_stayed);

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

    };



};

