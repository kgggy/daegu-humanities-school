var express = require('express');
var router = express.Router();
const sharp = require('sharp');

const multer = require("multer");
const path = require('path');
const fs = require('fs');

//var models = require('../../models');
var connection = require('../../../config/db').conn;

// 내 정보 상세보기
router.get('/:uid', async (req, res) => {
    try {
        const param = req.params.uid;
        let user;
        connection.query('select * from user where uid = ?', param, (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            user = results;
            res.status(200).json(user);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;