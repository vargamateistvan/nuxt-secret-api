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
        createdAt: new Date().getTime(),
        expiresAt: new Date(new Date().getTime() + expireAfter * 60000 ),
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

router.get('/secret/:hash', (req, res) => {
    console.log('REQUEST', req.params.hash);
    res.json({
        hash: "[The hash of the string]",
        secretText: "[The original text]",
        createdAt: "[The Timestamp the secret was created]",
        expiresAt: "[The Timestamp the secret if TTL is given]",
        remainingViews: 0
    });
});

module.exports = router
