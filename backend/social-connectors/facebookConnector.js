import axios from 'axios';

/**
 * Facebook Pages Graph API Connector
 */
export class FacebookConnector {
  constructor(config = {}) {
    this.clientId = config.clientId || process.env.FACEBOOK_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.FACEBOOK_CLIENT_SECRET;
    this.redirectUri = config.redirectUri || process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:5002/api/social/facebook/callback';
    this.graphBase = 'https://graph.facebook.com/v19.0';
  }

  getAuthorizationUrl(state) {
    const scopes = [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'pages_read_user_content'
    ].join(',');

    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&scope=${scopes}&response_type=code&state=${state}`;
  }

  async exchangeCodeForToken(code) {
    if (!this.clientId || this.clientId === 'your_facebook_app_id') {
      return {
        accessToken: `FB_DEMO_TOKEN_${Date.now()}`,
        expiresIn: 5184000,
        tokenType: 'bearer',
        isSimulated: true
      };
    }

    const res = await axios.get(`${this.graphBase}/oauth/access_token`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code
      }
    });

    return {
      accessToken: res.data.access_token,
      expiresIn: res.data.expires_in || 5184000,
      tokenType: 'bearer',
      isSimulated: false
    };
  }

  async getManagedPages(userAccessToken) {
    if (userAccessToken.startsWith('FB_DEMO_TOKEN_')) {
      return [
        {
          id: '108429104829104',
          name: 'Urban Blend Roasters',
          category: 'Coffee Shop & Roastery',
          tasks: ['ANALYZE', 'ADVERTISE', 'MODERATE', 'CREATE_CONTENT', 'MANAGE'],
          followersCount: 24200,
          pageAccessToken: `PAGE_DEMO_TOKEN_${Date.now()}`,
          picture: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
          dataSource: 'demo_simulation'
        }
      ];
    }

    const res = await axios.get(`${this.graphBase}/me/accounts`, {
      params: {
        fields: 'id,name,category,tasks,access_token,picture{url},fan_count',
        access_token: userAccessToken
      }
    });

    return res.data.data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tasks: p.tasks,
      followersCount: p.fan_count || 0,
      pageAccessToken: p.access_token,
      picture: p.picture?.data?.url,
      dataSource: 'actual_platform'
    }));
  }

  async getPageFeed(pageId, pageAccessToken, limit = 25) {
    if (pageAccessToken.startsWith('PAGE_DEMO_TOKEN_') || pageAccessToken.startsWith('FB_DEMO_TOKEN_')) {
      return [];
    }

    const res = await axios.get(`${this.graphBase}/${pageId}/feed`, {
      params: {
        fields: 'id,message,created_time,full_picture,shares,reactions.summary(true),comments.summary(true)',
        limit,
        access_token: pageAccessToken
      }
    });

    return res.data.data.map(item => ({
      externalPostId: item.id,
      content: item.message || '',
      platform: 'facebook',
      media: item.full_picture ? [{ url: item.full_picture, type: 'image' }] : [],
      publishedAt: new Date(item.created_time),
      status: 'published',
      dataSource: 'actual_platform',
      metricsSnapshot: {
        likes: item.reactions?.summary?.total_count || 0,
        comments: item.comments?.summary?.total_count || 0,
        shares: item.shares?.count || 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0
      }
    }));
  }

  async publishToPage(pageId, pageAccessToken, { message, link }) {
    if (pageAccessToken.includes('DEMO') || pageAccessToken.includes('SIMULATED') || !this.clientId || this.clientId === 'your_facebook_app_id') {
      return {
        id: `sim_fb_${Date.now()}`,
        isSimulated: true,
        message: 'Simulated Facebook publication successful (Demo Environment)'
      };
    }

    const res = await axios.post(`${this.graphBase}/${pageId}/feed`, null, {
      params: {
        message,
        link,
        access_token: pageAccessToken
      }
    });

    return {
      id: res.data.id,
      isSimulated: false,
      message: 'Published successfully to Facebook Page'
    };
  }
}
