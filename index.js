var LaunchDarkly = require('ldclient-node');

// TODO : Enter your LaunchDarkly SDK key here
ldclient = LaunchDarkly.init("YOUR_SDK_KEY");

user = {
   "firstName":"Bob",
   "lastName":"Loblaw",
   "key":"bob@example.com",
   "custom":{
      "groups":"beta_testers"
   }
};

///////////////////////////////////////////////////////////////////////////////
// All users will register an impression on the ab-test flag
ldclient.once('ready', function() {
  ldclient.variation("ab-test", user, false, function(err, abTest) {
    if (abTest) {
      console.log("Showing experience A to " + user.key );
    } else {
      console.log("Showing experience B to " + user.key);
    }

    ldclient.flush(function() {
      ldclient.close();
    });
  });
});

///////////////////////////////////////////////////////////////////////////////
// Only users who recieve the show-feature flag will register an impression on the ab-test flag
ldclient.once('ready', function() {
  ldclient.variation("show-feature", user, false, function(err, showFeature) {
    if(showFeature) {
      console.log("Feature shown to " + user.key );
      ldclient.variation("ab-test", user, false, function(err, abTest) {
        if (abTest) {
          console.log("Showing experience A to " + user.key );
        } else {
          console.log("Showing experience B to " + user.key);
        }

        ldclient.flush(function() {
          ldclient.close();
        });
      });
    } else {
      console.log("Feature NOT shown to " + user.key );
      ldclient.flush(function() {
        ldclient.close();
      });
    }
  });
});
///////////////////////////////////////////////////////////////////////////////
