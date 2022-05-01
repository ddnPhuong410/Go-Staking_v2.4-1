var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.listen('0413');
console.log('Running at\nhttp://localhost:0413');