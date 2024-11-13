const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config = require('../config');
const fs = require('fs');
const path = require('path');

router.post('/oauth/access_token', async (req, res) => {
    const { client_id, client_secret, grant_type, redirect_uri, code } = req.body;

    const url = 'https://api.instagram.com/oauth/access_token';
    const params = new URLSearchParams();
    params.append('client_id', config.instagram.clientId);
    params.append('client_secret', config.instagram.clientSecret);
    params.append('grant_type', "authorization_code");
    params.append('redirect_uri', config.instagram.redirectUri);
    params.append('code', code);
    console.log('Params:', params);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();
        if (data.error_type) {
            console.error('Error fetching access token:', data);
            return res.json(data);
        }

        console.log('Access token:', data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Error fetching access token' });
    }
});

router.get('/post/:username', async (req, res) => {
    const { username } = req.params;
    const url = 'https://v3.clipdown.app/api/ajaxSearch';
    const params = `q=https%3A%2F%2Fwww.instagram.com%2F${username}&t=media&lang=es&v=v2`

    const headers = {
        'Accept': '*/*',
        'Accept-Language': 'es-AR,es-419;q=0.9,es;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://clipdown.app',
        'Referer': 'https://clipdown.app/'
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: params
    });
    
    const json = await response.json();
    const html = json.data;
    const regex = /(https:\/\/i\.snapcdn\.app\/photo\?[^"]*)"*/g;
    const urls = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        urls.push(match[1]);
    }
    res.json({ urls });
});

module.exports = router;