const express = require("express");
const https = require("http");
const bodyParser = require("body-parser");

// sets up new app using express module.
const app = express();

// set up bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  // ask user for what city they want
  res.sendFile(__dirname + "/index.html");
});


// when we get response from the user about which city they want.
app.post("/", function(req, res) {
  const query = req.body.cityName;

  const url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=d2a0ccfe6daacf5709efd72f40b0e09a&units=imperial"

  https.get(url, function(response) { // this line makes a GET request to the url
  // here we can parse the data that the API gives back to us

  // this line is useful to see how the request was handled by their servers
  console.log("StatusCode: " + response.statusCode);

  // creates a callback when we get data.
  response.on("data", function(data) {
    // changes hex data to javascript object
    const weatherData = JSON.parse(data)
    // JSON.stringify() does the opposite, crams the data into a single string

    // access individual elements in JSON data, made easy using chrome extension called json  viewer awesome
    const conditions = weatherData.weather[0].description;
    const temp = weatherData.main.temp;

    // write data to response first, then once we're done send it.
    res.write("<h1>The conditions in " + query +  " is " + conditions + "</h1>");
    res.write("<h3>The temperature is " + temp + "</h3>");
    res.send();
  })

});

});




app.listen(3000, function() {
  console.log("server started on port 3000");
});
