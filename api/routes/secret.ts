const { Router } = require('express')
const SecretModel = require('../models/secret')
const router = Router();

type SecretRequest = {
    secret: string;
    expireAfterViews: number;
    expireAfter: number; // minutes, 0 never expires
}

type SecretResponse = {
    hash: string;
    secretText: string;
    createdAt: number;
    expiresAt: string;
    remainingViews: number;
}

router.post('/secret', async (req, res) => {
    const { secret, expireAfterViews, expireAfter } = req.body;
    const newSecret = new SecretModel({
        hash: Buffer.from(secret, 'binary').toString('base64'),
        secretText: secret,
        createdAt: new Date(),
        expiresAt: new Date(new Date().getTime() + expireAfter * 60000),
        remainingViews: expireAfterViews
    })
    await newSecret.save(err => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json(newSecret);
        }
    });
});

router.get('/secret/:hash', async(req, res) => {
    console.log('REQUEST', req.params.hash);
    const secret = await SecretModel.findOne({hash: req.params.hash}, (err) => {
        if (err) {
            console.error(err);
        }
    });
    res.json(secret);
});

module.exports = router
