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

router.post('/secret', async (req, res, next) => {
    const { secretText, expireAfterViews, expireAfter } = req.body;
    if (!secretText || !expireAfterViews || !expireAfter) {
        return res.status(400).json({
            data: null,
            success: false,
            status: 400,
            error: 'Missing required parameters'
        })
    }
    const secret = new SecretModel({
        hash: Buffer.from(secretText + Math.random() * expireAfterViews, 'binary').toString('base64'),
        secretText: secretText,
        createdAt: new Date(),
        expiresAt: expireAfter > 0 ? new Date(new Date().getTime() + expireAfter * 60000) : 0,
        remainingViews: expireAfterViews
    });
    const savedSecret = await secret.save();
    return res.status(200).json({
        data: savedSecret,
        success: true,
        status: 200,
        error: null
    });
});

router.get('/secret/:hash', async (req, res, next) => {
    const secret = await SecretModel.findOneAndUpdate({
        hash: req.params.hash
    }, {
        $inc: {
            remainingViews: -1
        }
    });
    if ((secret.expiresAt > 0 && secret.expiresAt < new Date()) || secret.remainingViews === 0) {
        return res.status(403).json({
            data: null,
            success: false,
            status: 403,
            error: 'Secret is expired' 
        })
    }
    return res.status(200).json({ 
        data: secret,
        success: true,
        status: 200,
        error: null
    });
});

router.get('/secrets', async (req, res, next) => {
    const secretsExpiredWithTime = await SecretModel.find({
        expiresAt: {
            $gte: new Date()
        },
        remainingViews: {
            $gt: 0
        }
    });
    const secretsExpiredWithView = await SecretModel.find({
        expiresAt: 0,
        remainingViews: {
            $gt: 0
        }
    });
    return res.status(200).json({ 
        data: [...secretsExpiredWithTime, ...secretsExpiredWithView],
        success: true,
        status: 200,
        error: null
    });
});

module.exports = router
