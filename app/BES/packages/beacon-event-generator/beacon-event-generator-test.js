Tinytest.add('Beg - should calculate no. of beacon events to generate correctly when seconds stayed is a positive integer', function (test) {

  var result_for_staying_0_second = Beg.calculateNumberOfRangeEventToSend(0);
  var result_for_staying_1_second = Beg.calculateNumberOfRangeEventToSend(1);
  var result_for_staying_2_second = Beg.calculateNumberOfRangeEventToSend(2);
  var result_for_staying_3_second = Beg.calculateNumberOfRangeEventToSend(3);
  var result_for_staying_4_second = Beg.calculateNumberOfRangeEventToSend(4);
  var result_for_staying_5_second = Beg.calculateNumberOfRangeEventToSend(5);
  var result_for_staying_6_second = Beg.calculateNumberOfRangeEventToSend(6);

  test.equal( result_for_staying_0_second["didRangeBeacons"], 0);
  test.equal( result_for_staying_0_second["didExitRegion"],   0);

  test.equal( result_for_staying_1_second["didRangeBeacons"], 1);
  test.equal( result_for_staying_1_second["didExitRegion"],   1);

  test.equal( result_for_staying_2_second["didRangeBeacons"], 2);
  test.equal( result_for_staying_2_second["didExitRegion"],   1);

  test.equal( result_for_staying_3_second["didRangeBeacons"], 3);
  test.equal( result_for_staying_3_second["didExitRegion"],   1);

  test.equal( result_for_staying_4_second["didRangeBeacons"], 4);
  test.equal( result_for_staying_4_second["didExitRegion"],   1);

  test.equal( result_for_staying_5_second["didRangeBeacons"], 5);
  test.equal( result_for_staying_5_second["didExitRegion"],   1);

  test.equal( result_for_staying_6_second["didRangeBeacons"], 5);
  test.equal( result_for_staying_6_second["didExitRegion"],   1);

});

Tinytest.add('Beg - should calculate no. of beacon events to generate correctly when seconds stayed is float', function(test){

  var result1 = Beg.calculateNumberOfRangeEventToSend(0.4);
  var result2 = Beg.calculateNumberOfRangeEventToSend(1.32);
  var result3 = Beg.calculateNumberOfRangeEventToSend(2.8);
  var result4 = Beg.calculateNumberOfRangeEventToSend(3.99);
  var result5 = Beg.calculateNumberOfRangeEventToSend(4.03);
  var result6 = Beg.calculateNumberOfRangeEventToSend(5.68);

  test.equal( result1["didRangeBeacons"], 1);
  test.equal( result1["didExitRegion"],   1);

  test.equal( result2["didRangeBeacons"], 1);
  test.equal( result2["didExitRegion"],   1);

  test.equal( result3["didRangeBeacons"], 2);
  test.equal( result3["didExitRegion"],   1);

  test.equal( result4["didRangeBeacons"], 3);
  test.equal( result4["didExitRegion"],   1);

  test.equal( result5["didRangeBeacons"], 4);
  test.equal( result5["didExitRegion"],   1);

  test.equal( result6["didRangeBeacons"], 5);
  test.equal( result6["didExitRegion"],   1);

});


Tinytest.add('Beg - should create no beacon event when seconds stayed is negative', function(test){

  var result1 = Beg.calculateNumberOfRangeEventToSend(-1);
  var result2 = Beg.calculateNumberOfRangeEventToSend(-0.01);
  var result3 = Beg.calculateNumberOfRangeEventToSend(-84.3);

  test.equal( result1["didRangeBeacons"], 0);
  test.equal( result1["didExitRegion"],   0);

  test.equal( result2["didRangeBeacons"], 0);
  test.equal( result2["didExitRegion"],   0);

  test.equal( result3["didRangeBeacons"], 0);
  test.equal( result3["didExitRegion"],   0);


});



var seed1 = {
	"setup": {
		"beacons": {
			"beaA": {
				"minor": 3,
				"major": 4,
				"uuid": "14258BDA-B644-4520-8F0C-720EAF059935"
			}
		},
		"mobiles": {
			"my_iphone": {
				"uuid": "D7AD6E44-7A9E-4A76-9227-C16903E549A5"
			}
		}
	},
	"events_between": {
		"beaA": {
			"my_iphone": [
				{
					"seconds_stayed": 7,
					"start_time" : "2014-06-05 15:39:29"
				}
			]
		}
	}
};

function getBeaconEventsGeneratedFromSimulationSeed(seed){
	var result = [];
	Beg.processSimulationSeed(seed, function(beacon_event){
		result.push(beacon_event);
	});
	return result;
}

Tinytest.add('Beg - All generated beacon event must have the fields: major, minor, uuid, visitor_uuid, type, created_at', function(test){

	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);
	_.each(result, function(event){
		test.include(_.keys(event), 'major');
		test.include(_.keys(event), 'minor');
		test.include(_.keys(event), 'uuid');
		test.include(_.keys(event), 'visitor_uuid');
		test.include(_.keys(event), 'type');
		test.include(_.keys(event), 'created_at');
	});

});

Tinytest.add('Beg - Beacon events\' type can only be "didRangeBeacons" or "didExitRegion"', function(test){

	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);
	_.each(result, function(event){
		test.include(["didRangeBeacons", "didExitRegion"], event.type);
	});

});

Tinytest.add('Beg - A beacon event\'s minor, major and uuid should equal to that of the beacon which generates it', function(test){


	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);

	_.each( result, function(event){
		test.equal( event["major"], seed1.setup.beacons.beaA.major );
		test.equal( event["minor"], seed1.setup.beacons.beaA.minor );
		test.equal( event["uuid"], seed1.setup.beacons.beaA.uuid );
	});

});

Tinytest.add('Beg - A beacon event\'s visitor_uuid,  should equal to uuid of the mobile which generates it', function(test){

	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);

	_.each( result, function(event){
		test.equal( event["visitor_uuid"], seed1.setup.mobiles.my_iphone.uuid );
	});

});


Tinytest.add('Beg - When stay time > 0, "didRangeBeacons" events should be emitted once per seconds for the first 5 seconds and no more', function(test){
	
	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);

	var creation_start_time = new Date( seed1["events_between"]["beaA"]["my_iphone"][0]["start_time"] );
	var creation_start_time_in_ms = creation_start_time.getTime();

	var creation_times = _.map(result, function(event){ return event.created_at; } );

	test.equal(creation_times[0], creation_start_time.toString() );
	test.equal(creation_times[1], new Date(creation_start_time_in_ms + 1000 * 1).toString() );
	test.equal(creation_times[2], new Date(creation_start_time_in_ms + 1000 * 2).toString() );
	test.equal(creation_times[3], new Date(creation_start_time_in_ms + 1000 * 3).toString() );
	test.equal(creation_times[4], new Date(creation_start_time_in_ms + 1000 * 4).toString() );
	
});


Tinytest.add('Beg - Exactly 1 "didExitRegion" event should be emitted once a mobile\'s stay time in beacon is over', function(test){
	
	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);

	var creation_start_time = new Date( seed1["events_between"]["beaA"]["my_iphone"][0]["start_time"] );
	var creation_start_time_in_ms = creation_start_time.getTime();
	var stay_time_in_second = seed1["events_between"]["beaA"]["my_iphone"][0]["seconds_stayed"]

	var creation_times = _.map(result, function(event){ return event.created_at; } );

	test.equal(creation_times[creation_times.length - 1 ], new Date(creation_start_time_in_ms + 1000 * stay_time_in_second).toString() );
	
});

Tinytest.add('Beg - When stay time > 5, there should be only 5 "didRangeBeacons" events and 1 "didExitRegion" event', function(test){
	
	var result = getBeaconEventsGeneratedFromSimulationSeed(seed1);

	var event_types = _.map(result, function(event){ return event.type; } );

	test.equal(event_types.length, 6);
	test.equal(event_types[0], "didRangeBeacons");
	test.equal(event_types[1], "didRangeBeacons");
	test.equal(event_types[2], "didRangeBeacons");
	test.equal(event_types[3], "didRangeBeacons");
	test.equal(event_types[4], "didRangeBeacons");
	test.equal(event_types[5], "didExitRegion");

});




var seed2 = {
	"setup": {
		"beacons": {
			"beaA": {
				"minor": 3,
				"major": 4,
				"uuid": "14258BDA-B644-4520-8F0C-720EAF059935"
			}
		},
		"mobiles": {
			"my_iphone": {
				"uuid": "D7AD6E44-7A9E-4A76-9227-C16903E549A5"
			}
		}
	},
	"events_between": {
		"beaA": {
			"my_iphone": [
				{
					"seconds_stayed": 1,
					"start_time" : "2014-03-02 15:59:25"
				},
				{
					"seconds_stayed": 2,
					"start_time" : "2014-06-15 19:20:21"
				},
				{
					"seconds_stayed": 70,
					"start_time" : "2014-07-15 19:20:21"
				}
			]
		}
	}
};

Tinytest.add('Beg - should created all beacon events from multiple encounters of a beacon and a mobile', function(test){
	
	var result = getBeaconEventsGeneratedFromSimulationSeed(seed2);
	test.equal(result.length, 2 + 3 + 6);

	_.each(result, function(event){
		var i = result.indexOf(event);
		if( i==1 || i==4 || i==10){
			test.equal(event.type, 'didExitRegion');
		}else{
			test.equal(event.type, 'didRangeBeacons');
		}
	});

});





var seed3 = {
	"setup": {
		"beacons": {
			"beaA": {
				"minor": 3,
				"major": 4,
				"uuid": "14258BDA-B644-4520-8F0C-720EAF059935"
			},
			"beaB": {
				"minor": 5,
				"major": 4,
				"uuid": "94258BDA-B644-4520-8F0C-720EAF059935"
			}
		},
		"mobiles": {
			"phoneA": {
				"uuid": "D7AD6E44-7A9E-4A76-9227-C16903E549A5"
			},
			"phoneB": {
				"uuid": "C7AD6E44-7A9E-4A76-9227-C16903E549A5"
			}
		}
	},
	"events_between": {
		"beaA": {
			"phoneA": [
				{
					"seconds_stayed": 2,
					"start_time" : "2014-04-02 15:59:25"
				}
			],
			"phoneB": [
				{
					"seconds_stayed": 1,
					"start_time" : "2014-03-12 15:59:25"
				}
			]
		},
		"beaB": {
			"phoneA": [
				{
					"seconds_stayed": 3,
					"start_time" : "2014-05-07 15:59:25"
				}
			],
			"phoneB": [
				{
					"seconds_stayed": 6,
					"start_time" : "2015-03-22 15:59:25"
				}
			]
		}
	}
};

Tinytest.add('Beg - should created all beacon events for encounters of different beacons and mobiles', function(test){
	
	var result = getBeaconEventsGeneratedFromSimulationSeed(seed3);
	test.equal(result.length, 3 + 2 + 4 + 6);

	var events_from_encounter_of_beaA_and_phoneA = _.filter(result, function(event){ return event.uuid == seed3.setup.beacons.beaA.uuid && event.visitor_uuid == seed3.setup.mobiles.phoneA.uuid });
	var events_from_encounter_of_beaA_and_phoneB = _.filter(result, function(event){ return event.uuid == seed3.setup.beacons.beaA.uuid && event.visitor_uuid == seed3.setup.mobiles.phoneB.uuid });
	var events_from_encounter_of_beaB_and_phoneA = _.filter(result, function(event){ return event.uuid == seed3.setup.beacons.beaB.uuid && event.visitor_uuid == seed3.setup.mobiles.phoneA.uuid });
	var events_from_encounter_of_beaB_and_phoneB = _.filter(result, function(event){ return event.uuid == seed3.setup.beacons.beaB.uuid && event.visitor_uuid == seed3.setup.mobiles.phoneB.uuid });

	test.equal(events_from_encounter_of_beaA_and_phoneA.length, 3);
	test.equal(events_from_encounter_of_beaA_and_phoneB.length, 2);
	test.equal(events_from_encounter_of_beaB_and_phoneA.length, 4);
	test.equal(events_from_encounter_of_beaB_and_phoneB.length, 6);
});

