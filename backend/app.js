const express = require('express')

const app = express();

app.get('/',(req,res) =>{
    res.send("Hello Sahil");
})

app.listen(3000, () => {
    console.log("server is  running beautifully");
})
