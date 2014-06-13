var FIREBASE_URL = 'https://beacon-event-sim.firebaseio.com/';




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

                        Beg.processSimulationSeed(json, function(beacon_event){ 
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

                        Beg.processSimulationSeed(json, function(beacon_event){
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
