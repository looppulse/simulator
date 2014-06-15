Package.describe({
  summary: "Simulation Seed Processing to simulate beacon events generated from n mobiles, m ibeacons situation"
});

Package.on_use(function (api) {
  api.use(["underscore"], ["client", "server"]);
  api.add_files(["beacon-event-generator.js"], ["client", "server"]);

  if (typeof api.export !== 'undefined') {
    api.export("Beg", ["client", "server"]);
  }
});

Package.on_test(function (api) {
  api.use(["underscore", "beacon-event-generator", "tinytest", "test-helpers"], ["client", "server"]);
  api.add_files("beacon-event-generator-test.js", ["client", "server"]);
});


