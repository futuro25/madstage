const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/oauth/access_token', async (req, res) => {
  const { client_id, client_secret, grant_type, redirect_uri, code } = req.body;

  const url = 'https://api.instagram.com/oauth/access_token';
  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);
  params.append('grant_type', grant_type);
  params.append('redirect_uri', redirect_uri);
  params.append('code', code);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).json({ error: 'Error fetching access token' });
  }
});

module.exports = router;