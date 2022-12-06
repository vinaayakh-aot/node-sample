const express = require('express');
const router = express.Router();
const fs = require("fs");
const { promisify } = require("util");
const fileName = "temp.txt";
const emitter = require('../emitter');

const healthCheck = (req, res) => {
    console.log(req.body);
    return res.status(200).send(req.body)
}


router.route('/')
    .get(healthCheck)
    .post(async (req, res) => {
        const data = req.body;


        // fs.writeFile("temp.txt", data, (err) => {
        //     if (err) console.log(err);
        //     console.log("Successfully Written to File.");
        // });
        
        const fileWritePromise = promisify(fs.writeFile)
        await fileWritePromise(fileName, data);
        emitter.emitter.emit("listener", data);
        return res.send('Upload called successfully');
    })
    .put(async (req, res) => {
        const data = req.body;
        // fs.writeFile("temp.txt", data, (err) => {
        //     if (err) console.log(err);
        //     console.log("Successfully Written to File.");
        // });
        const fileWritePromise = promisify(fs.appendFile)
        await fileWritePromise(fileName, data);
        return res.send('Update called successfully');
    });


module.exports = router;