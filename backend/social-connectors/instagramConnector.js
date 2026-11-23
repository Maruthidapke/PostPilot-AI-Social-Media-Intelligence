import axios from 'axios';

/**
 * Instagram Graph API Connector
 * Supports Instagram Business and Creator accounts connected to a Facebook Page
 */
export class InstagramConnector {
  constructor(config = {}) {
    this.clientId = config.clientId || process.env.INSTAGRAM_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.INSTAGRAM_CLIENT_SECRET;
    this.redirectUri = config.redirectUri || process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:5002/api/social/instagram/callback';
    this.graphBase = 'https://graph.facebook.com/v19.0';
  }

  /**
   * 1. Get Official OAuth Authorization URL
   */
  getAuthorizationUrl(state) {
    const scopes = [
      'instagram_basic',
      'instagram_manage_insights',
      'instagram_manage_comments',
      'instagram_content_publish',
      'pages_show_list',
      'pages_read_engagement'
    ].join(',');

    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&scope=${scopes}&response_type=code&state=${state}`;
  }

  /**
   * 2. Exchange authorization code for access token
   */
  async exchangeCodeForToken(code) {
    // If running in development without live Meta keys, provide simulated authorization
    if (!this.clientId || this.clientId === 'your_instagram_app_id') {
      return {
        accessToken: `IG_DEMO_TOKEN_${Date.now()}`,
        expiresIn: 5184000, // 60 days
        tokenType: 'bearer',
        isSimulated: true
      };
    }

    const tokenUrl = `${this.graphBase}/oauth/access_token`;
    const response = await axios.get(tokenUrl, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code: code
      }
    });

    const shortLivedToken = response.data.access_token;

    // Exchange for long-lived 60-day token
    const longLivedResponse = await axios.get(`${this.graphBase}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        fb_exchange_token: shortLivedToken
      }
    });

    return {
      accessToken: longLivedResponse.data.access_token,
      expiresIn: longLivedResponse.data.expires_in || 5184000,
      tokenType: 'bearer',
      isSimulated: false
    };
  }

  /**
   * 3. Fetch connected Instagram Business Account
   */
  async getAccountProfile(accessToken) {
    if (accessToken.startsWith('IG_DEMO_TOKEN_')) {
      return {
        id: '17841405309211029',
        username: 'urbanblend_coffee',
        displayName: 'Urban Blend Coffee Roasters',
        profileImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop',
        accountType: 'business',
        followersCount: 18450,
        followingCount: 342,
        mediaCount: 142,
        dataSource: 'demo_simulation'
      };
    }

    // Step A: Get Facebook pages
    const pagesRes = await axios.get(`${this.graphBase}/me/accounts`, {
      params: { access_token: accessToken }
    });

    if (!pagesRes.data.data || pagesRes.data.data.length === 0) {
      throw new Error('No Facebook Page found. Instagram Professional accounts must be connected to a Facebook Page.');
    }

    const pageId = pagesRes.data.data[0].id;
    // Step B: Get linked Instagram Business account
    const igRes = await axios.get(`${this.graphBase}/${pageId}`, {
      params: {
        fields: 'instagram_business_account{id,username,name,profile_picture_url,followers_count,follows_count,media_count}',
        access_token: accessToken
      }
    });

    const igAccount = igRes.data.instagram_business_account;
    if (!igAccount) {
      throw new Error('No Instagram Business or Creator account connected to the selected Facebook Page.');
    }

    return {
      id: igAccount.id,
      username: igAccount.username,
      displayName: igAccount.name || igAccount.username,
      profileImage: igAccount.profile_picture_url,
      accountType: 'business',
      followersCount: igAccount.followers_count || 0,
      followingCount: igAccount.follows_count || 0,
      mediaCount: igAccount.media_count || 0,
      dataSource: 'actual_platform'
    };
  }

  /**
   * 4. Fetch Posts (Media)
   */
  async getPosts(igUserId, accessToken, limit = 25) {
    if (accessToken.startsWith('IG_DEMO_TOKEN_')) {
      return []; // fallback handled in sync job
    }

    const res = await axios.get(`${this.graphBase}/${igUserId}/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
        limit: limit,
        access_token: accessToken
      }
    });

    return res.data.data.map(item => ({
      externalPostId: item.id,
      content: item.caption || '',
      platform: 'instagram',
      media: [{
        url: item.media_url || item.thumbnail_url,
        type: item.media_type === 'VIDEO' ? 'video' : 'image'
      }],
      publishedAt: new Date(item.timestamp),
      status: 'published',
      dataSource: 'actual_platform',
      metricsSnapshot: {
        likes: item.like_count || 0,
        comments: item.comments_count || 0,
        shares: 0, // Instagram Graph API does not expose shares on standard tier
        saves: 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0
      }
    }));
  }

  /**
   * 5. Fetch Media Insights where permitted
   */
  async getMediaInsights(mediaId, accessToken) {
    if (accessToken.startsWith('IG_DEMO_TOKEN_')) {
      return { reach: null, impressions: null, saves: null, note: 'Not available through connected account permissions.' };
    }

    try {
      const res = await axios.get(`${this.graphBase}/${mediaId}/insights`, {
        params: {
          metric: 'impressions,reach,saved,engagement',
          access_token: accessToken
        }
      });
      const data = {};
      res.data.data.forEach(metric => {
        data[metric.name] = metric.values[0]?.value || 0;
      });
      return data;
    } catch (e) {
      return { note: 'Not available through connected account permissions.' };
    }
  }

  /**
   * 6. Fetch Comments on a post
   */
  async getComments(mediaId, accessToken) {
    if (accessToken.startsWith('IG_DEMO_TOKEN_')) {
      return [];
    }

    try {
      const res = await axios.get(`${this.graphBase}/${mediaId}/comments`, {
        params: {
          fields: 'id,text,timestamp,username',
          limit: 50,
          access_token: accessToken
        }
      });

      return res.data.data.map(c => ({
        externalCommentId: c.id,
        commenterUsername: c.username || 'instagram_user',
        commentText: c.text,
        createdAt: new Date(c.timestamp),
        source: 'actual_platform'
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * 7. Publish Post (2-step Instagram Content Publishing API)
   */
  async publishPost(igUserId, accessToken, { imageUrl, caption }) {
    if (accessToken.includes('DEMO') || accessToken.includes('SIMULATED') || !this.clientId || this.clientId === 'your_instagram_app_id') {
      return {
        id: `sim_ig_${Date.now()}`,
        isSimulated: true,
        message: 'Simulated Instagram publication successful (Demo Environment)'
      };
    }

    // Step A: Create container
    const containerRes = await axios.post(`${this.graphBase}/${igUserId}/media`, null, {
      params: {
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
      }
    });

    const creationId = containerRes.data.id;

    // Step B: Publish container
    const publishRes = await axios.post(`${this.graphBase}/${igUserId}/media_publish`, null, {
      params: {
        creation_id: creationId,
        access_token: accessToken
      }
    });

    return {
      id: publishRes.data.id,
      isSimulated: false,
      message: 'Published successfully to Instagram'
    };
  }
}
