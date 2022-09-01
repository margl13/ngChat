const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/ngchat,'));
app.get('/*', function (req,res) {
  res.sendFile(path.join(__dirname + '/dist/ngchat/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log("App is running on port " + port)});
