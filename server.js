const express = require('express');
const app = require('./src/app')
const PORT = 8080
app.set('port', PORT)

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});