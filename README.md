Beacon Event Simulator
======================

At [Loop Pulse](http://www.looppulse.com), we work with iBeacons to detect proximity and trigger events on our server side. However, simulating lots of beacon events using actual iBeacons and mobile devices is troublesome and hard to reproduce 100%. We need to build an application to simulate these beacon events which are normally sent by our mobile SDK.

### User flow
  1. End user of this simulator will specify the sequence of the events via a JSON which can be part of the startup parameter or something uploadable. You define the content of this JSON.
  2. Beacon events are then sent via your application to a [Firebase](https://www.firebase.com/account/) end point. You can create a free developer account on Firebase.

### Specification of the events
  * Each beacon event has at least these properties:
    1. Beacon's proximity UUID
    2. Beacon's major value
    3. Beacon's minor value
    4. Type of beacon events: `didRangeBeacons` or `didExitRegion`
    5. Timestamp when the event was created on the device
    6. Visitor's UUID which is unique per device
  * Normally Loop Pulse's mobile SDK will send `didRangeBeacons` once every second for the first 5 seconds when the device is in proximity with the given iBeacon. Then there will be no more events until such device leaves the region and a `didExitRegion` will be fired. Please note that a device can be in proximity with more than one iBeacon at the same time and there can be multiple devices in proximity with the same iBeacon.
   
### Deliverables
  1. You can build this simulator as a Meteor, iOS or Android application.
  2. Provide visual feedback as simulated events are getting sent.
  3. Describe the pro's and con's of your proposed solution.

You should commit your code into a public github repo and include a README.md with details on how to launch your application and the pro and con of your solution.
  
### Bonus
  * Create a 'live' mode which simulates foot traffic in a retail store programmatically. Imagine a retail store where each product section will have an iBeacon installed. Your application will utilize artificial intelligence to simulate realistic pattern on how a store visitor would check out different product sections. The configuration file will include specifications like how many iBeacons are installed and how many visitors are expected. 
