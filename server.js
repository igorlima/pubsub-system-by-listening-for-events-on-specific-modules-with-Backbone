var express      = require('express');
 
var app = express()
  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);
