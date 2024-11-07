const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/oauth/access_token', async (req, res) => {
    const { client_id, client_secret, grant_type, redirect_uri, code } = req.body;

    const url = 'https://api.instagram.com/oauth/access_token';
    const params = new URLSearchParams();
    params.append('client_id', "563145449698839");
    params.append('client_secret', "2795530e6b87a23ac35d2708763dd1e9");
    params.append('grant_type', "authorization_code");
    params.append('redirect_uri', "https://madstage-a16bef77c5b8.herokuapp.com/login");
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
          return res.status(400).json(data);
        }

        console.log('Access token:', data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Error fetching access token' });
    }
});

module.exports = router;