const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        console.log("Router Working");
        res.send('Routes');
    });


module.exports = router;