import axios from 'axios';

/**
 * LinkedIn Organization Connector
 */
export class LinkedInConnector {
  constructor(config = {}) {
    this.clientId = config.clientId || process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.LINKEDIN_CLIENT_SECRET;
    this.redirectUri = config.redirectUri || process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5002/api/social/linkedin/callback';
  }

  getAuthorizationUrl(state) {
    const scopes = ['r_liteprofile', 'w_member_social', 'r_organization_social', 'w_organization_social'].join(' ');
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&state=${state}&scope=${encodeURIComponent(scopes)}`;
  }

  async exchangeCodeForToken(code) {
    if (!this.clientId || this.clientId === 'your_linkedin_client_id') {
      return {
        accessToken: `LI_DEMO_TOKEN_${Date.now()}`,
        expiresIn: 5184000,
        tokenType: 'bearer',
        isSimulated: true
      };
    }

    const res = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }
    });

    return {
      accessToken: res.data.access_token,
      expiresIn: res.data.expires_in,
      tokenType: 'bearer',
      isSimulated: false
    };
  }

  async getProfile(accessToken) {
    if (accessToken.startsWith('LI_DEMO_TOKEN_')) {
      return {
        id: 'urn:li:organization:84920194',
        username: 'urban-blend-coffee',
        displayName: 'Urban Blend Coffee Co.',
        profileImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
        accountType: 'organization',
        followersCount: 6120,
        followingCount: 140,
        dataSource: 'demo_simulation'
      };
    }

    const res = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return {
      id: res.data.sub,
      username: res.data.preferred_username || res.data.name?.toLowerCase().replace(/\s+/g, ''),
      displayName: res.data.name,
      profileImage: res.data.picture,
      accountType: 'organization',
      followersCount: 0,
      followingCount: 0,
      dataSource: 'actual_platform'
    };
  }

  async publishPost(authorUrn, accessToken, { text }) {
    if (accessToken.includes('DEMO') || accessToken.includes('SIMULATED') || !this.clientId || this.clientId === 'your_linkedin_client_id') {
      return {
        id: `sim_li_${Date.now()}`,
        isSimulated: true,
        message: 'Simulated LinkedIn share successful (Demo Environment)'
      };
    }

    const res = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return {
      id: res.data.id,
      isSimulated: false,
      message: 'Published successfully to LinkedIn'
    };
  }
}
