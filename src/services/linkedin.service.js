const crypto = require('crypto');
const axios = require('axios');

const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI,
} = require('../config/env.js');

const LINKEDIN_AUTH_BASE =
  'https://www.linkedin.com/oauth/v2/authorization';

function getAuthUrl() {
  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    scope:
      'w_member_social r_liteprofile w_organization_social r_organization_social',
    state,
  });
  return `${LINKEDIN_AUTH_BASE}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      redirect_uri: LINKEDIN_REDIRECT_URI,
    });
    const response = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to exchange LinkedIn code for token');
  }
}

async function getLinkedInProfile(accessToken) {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch LinkedIn profile');
  }
}

async function publishToLinkedIn(accessToken, authorUrn, content) {
  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to publish to LinkedIn');
  }
}

module.exports = {
  getAuthUrl,
  exchangeCodeForToken,
  getLinkedInProfile,
  publishToLinkedIn,
};
