var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.static('app'))
  .use(connect.logger('dev'));
  // concise output colored by response status for development use

http.createServer(app).listen(8000);