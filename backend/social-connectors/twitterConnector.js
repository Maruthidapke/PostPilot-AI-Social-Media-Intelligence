import axios from 'axios';
import crypto from 'crypto';

/**
 * X (Twitter) API v2 Connector (OAuth 2.0 PKCE)
 */
export class TwitterConnector {
  constructor(config = {}) {
    this.clientId = config.clientId || process.env.TWITTER_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.TWITTER_CLIENT_SECRET;
    this.redirectUri = config.redirectUri || process.env.TWITTER_REDIRECT_URI || 'http://localhost:5002/api/social/twitter/callback';
  }

  getAuthorizationUrl(state, codeChallenge) {
    const scopes = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join('%20');
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&scope=${scopes}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  }

  async exchangeCodeForToken(code, codeVerifier) {
    if (!this.clientId || this.clientId === 'your_twitter_client_id') {
      return {
        accessToken: `TW_DEMO_TOKEN_${Date.now()}`,
        refreshToken: `TW_REFRESH_TOKEN_${Date.now()}`,
        expiresIn: 7200,
        tokenType: 'bearer',
        isSimulated: true
      };
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`
        }
      }
    );

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      expiresIn: res.data.expires_in,
      tokenType: 'bearer',
      isSimulated: false
    };
  }

  async getProfile(accessToken) {
    if (accessToken.startsWith('TW_DEMO_TOKEN_')) {
      return {
        id: '2248201948',
        username: 'urbanblend',
        displayName: 'Urban Blend Coffee',
        profileImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop',
        accountType: 'creator',
        followersCount: 9840,
        followingCount: 520,
        dataSource: 'demo_simulation'
      };
    }

    const res = await axios.get('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = res.data.data;
    return {
      id: user.id,
      username: user.username,
      displayName: user.name,
      profileImage: user.profile_image_url,
      accountType: 'creator',
      followersCount: user.public_metrics?.followers_count || 0,
      followingCount: user.public_metrics?.following_count || 0,
      dataSource: 'actual_platform'
    };
  }

  async publishTweet(accessToken, { text }) {
    if (accessToken.includes('DEMO') || accessToken.includes('SIMULATED') || !this.clientId || this.clientId === 'your_twitter_client_id') {
      return {
        id: `sim_tw_${Date.now()}`,
        isSimulated: true,
        message: 'Simulated X/Twitter post successful (Demo Environment)'
      };
    }

    const res = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return {
      id: res.data.data.id,
      isSimulated: false,
      message: 'Published successfully to X'
    };
  }
}
