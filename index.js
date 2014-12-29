var express   = require('express'),
    request   = require('request'),
    app       = express();

API_ENDPOINT = 'http://api.elpais.com/ws/';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get("/api/*", function(req, res) {
  var options = {
    url: API_ENDPOINT + req.params[0],
    qs: req.query
  };

  req.pipe(request(options)).pipe(res);
});

app.listen(app.get('port'), function() {
  console.log("Express app is running at localhost:" + app.get('port'));
});
