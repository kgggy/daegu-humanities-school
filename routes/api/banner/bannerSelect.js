var express = require('express');
var router = express.Router();
const models = require("../../../models");

//광고 조회
router.get('/', async (req, res) => {
    try {
        const param = req.query.crewDiv;
        const all = [];
        const banner = await models.banner.findAll({
            where: {
                crewDiv: param
            },
            raw: true
        })
        // console.log(banner[0].bannerId)
        for (let i = 0; i < banner.length; i++) {
            const bannerAll = await models.file.findAll({
                where: {
                    bannerId: banner[i].bannerId
                },
                attributes: ["fileRoute", "fileOrgName", "fileType"],
                raw: true
            });
            banner[i]['fileRoute'] = bannerAll;
            all[i] = banner[i];
        }
        res.status(200).json(all);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;