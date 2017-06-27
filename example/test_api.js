var api = require('./lib/api');


var d = console.log;

var cb = () => {
  d('running callback');
  return;
}

d('api:', api.services.userService.list({ event : 1 }, { context : 2 }, cb));
