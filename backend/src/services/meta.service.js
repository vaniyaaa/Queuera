const crypto = require('crypto');
const axios = require('axios');

const {
  META_APP_ID,
  META_APP_SECRET,
  META_REDIRECT_URI,
} = require('../config/env.js');

const GRAPH_OAUTH_URL =
  'https://graph.facebook.com/v19.0/oauth/access_token';

const FACEBOOK_OAUTH_BASE = 'https://www.facebook.com/v19.0/dialog/oauth';

function getAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    redirect_uri: META_REDIRECT_URI,
    scope: 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish,pages_show_list',
    response_type: 'code',
    state,
  });
  return `${FACEBOOK_OAUTH_BASE}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  try {
    const response = await axios.get(GRAPH_OAUTH_URL, {
      params: {
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: META_REDIRECT_URI,
        code,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Failed to exchange code for token');
  }
}

async function getLongLivedToken(shortLivedToken) {
  try {
    const response = await axios.get(GRAPH_OAUTH_URL, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Failed to get long-lived token');
  }
}

async function getUserPages(accessToken) {
  try {
    const response = await axios.get(
      'https://graph.facebook.com/v19.0/me/accounts',
      {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,instagram_business_account',
        },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch user pages');
  }
}

async function publishToFacebook(pageAccessToken, pageId, content, mediaUrls) {
  try {
    const body = new URLSearchParams({
      message: content,
      access_token: pageAccessToken,
    });
    if (Array.isArray(mediaUrls) && mediaUrls.length > 0 && mediaUrls[0]) {
      body.append('link', mediaUrls[0]);
    }
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to publish to Facebook');
  }
}

async function publishToInstagram(
  pageAccessToken,
  igAccountId,
  content,
  mediaUrls,
) {
  try {
    const createBody = new URLSearchParams({
      caption: content,
      access_token: pageAccessToken,
    });
    if (Array.isArray(mediaUrls) && mediaUrls.length > 0 && mediaUrls[0]) {
      createBody.append('image_url', mediaUrls[0]);
    }
    const createRes = await axios.post(
      `https://graph.facebook.com/v19.0/${igAccountId}/media`,
      createBody.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    const creationId = createRes.data.id;
    const publishBody = new URLSearchParams({
      creation_id: creationId,
      access_token: pageAccessToken,
    });
    const publishRes = await axios.post(
      `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
      publishBody.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    return publishRes.data;
  } catch (err) {
    throw new Error('Failed to publish to Instagram');
  }
}

module.exports = {
  getAuthUrl,
  exchangeCodeForToken,
  getLongLivedToken,
  getUserPages,
  publishToFacebook,
  publishToInstagram,
};
