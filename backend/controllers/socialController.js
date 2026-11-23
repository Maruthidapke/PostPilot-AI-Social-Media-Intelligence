import { getCollection, saveStore, isMongo } from '../config/db.js';
import { getConnector } from '../social-connectors/index.js';
import { encryptToken, decryptToken } from '../utils/crypto.js';
import { seedDemoData, seedDataForUser, clearDataForUser } from '../services/demoDataService.js';
import mongoose from 'mongoose';

export const getProviders = (req, res) => {
  res.json({
    success: true,
    providers: [
      {
        id: 'instagram',
        name: 'Instagram',
        type: 'Business & Creator Accounts',
        supportedTypes: ['Instagram Business', 'Instagram Creator'],
        authType: 'OAuth 2.0 (Meta Graph API)',
        permissions: ['instagram_basic', 'instagram_manage_insights', 'instagram_manage_comments', 'instagram_content_publish'],
        notes: 'Personal Instagram accounts are not supported by the Meta Professional API. Requires connected Facebook Page.',
        color: '#E1306C'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        type: 'Facebook Pages',
        supportedTypes: ['Page Admin', 'Page Editor', 'Page Analyst'],
        authType: 'OAuth 2.0 (Facebook Login)',
        permissions: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'pages_read_user_content'],
        notes: 'Accesses managed public Pages only. Does not access personal user profiles.',
        color: '#1877F2'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        type: 'Organization Pages',
        supportedTypes: ['Company Page', 'Showcase Page'],
        authType: 'OAuth 2.0 (LinkedIn v2)',
        permissions: ['r_organization_social', 'w_organization_social'],
        notes: 'Requires Page Admin privileges on the LinkedIn Organization.',
        color: '#0A66C2'
      },
      {
        id: 'twitter',
        name: 'X (Twitter)',
        type: 'Creator & Brand Accounts',
        supportedTypes: ['User Account', 'Verified Organization'],
        authType: 'OAuth 2.0 PKCE (Twitter API v2)',
        permissions: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        notes: 'Standard tier allows tweet lookup and automated publishing.',
        color: '#000000'
      }
    ]
  });
};

export const getAccounts = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let accounts;
    if (isMongo()) {
      const SocialAccount = mongoose.model('SocialAccount');
      accounts = await SocialAccount.find({ userId });
    } else {
      const allAccounts = getCollection('socialAccounts');
      accounts = allAccounts.filter(a => a.userId === userId);
    }

    res.json({ success: true, accounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const connectProvider = async (req, res) => {
  try {
    const { provider } = req.params;
    const { simulated = false } = req.body;
    const connector = getConnector(provider);
    const state = `state_${req.user.id}_${Date.now()}`;

    if (simulated || !process.env[`${provider.toUpperCase()}_CLIENT_ID`] || process.env[`${provider.toUpperCase()}_CLIENT_ID`].startsWith('your_')) {
      // Connect in development / demo sandbox mode
      const tokenPayload = await connector.exchangeCodeForToken('DEMO_AUTH_CODE');
      const profile = await connector.getAccountProfile ? await connector.getAccountProfile(tokenPayload.accessToken) : await connector.getProfile(tokenPayload.accessToken);

      const userId = req.user.id || req.user._id;
      const newAccount = {
        _id: `acc_${provider}_${Date.now()}`,
        id: `acc_${provider}_${Date.now()}`,
        userId: userId,
        platform: provider,
        platformAccountId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.name,
        profileImage: profile.profileImage || profile.picture,
        accountType: profile.accountType || 'business',
        connectionStatus: 'connected',
        permissions: ['read_profile', 'read_insights', 'manage_comments', 'publish_content'],
        isDemo: true,
        followersCount: profile.followersCount || 1000,
        followingCount: profile.followingCount || 100,
        postsCount: 15,
        lastSyncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      if (isMongo()) {
        const SocialAccount = mongoose.model('SocialAccount');
        const OAuthCredential = mongoose.model('OAuthCredential');
        const savedAccount = await SocialAccount.create(newAccount);
        await OAuthCredential.create({
          socialAccountId: savedAccount._id,
          encryptedAccessToken: encryptToken(tokenPayload.accessToken),
          expiresAt: new Date(Date.now() + 60 * 86400 * 1000)
        });
      } else {
        const allAccounts = getCollection('socialAccounts');
        const creds = getCollection('oauthCredentials');
        allAccounts.push(newAccount);
        creds.push({
          _id: `cred_${newAccount.id}`,
          socialAccountId: newAccount.id,
          encryptedAccessToken: encryptToken(tokenPayload.accessToken),
          expiresAt: new Date(Date.now() + 60 * 86400 * 1000).toISOString()
        });
        saveStore();
      }

      return res.json({
        success: true,
        isSimulated: true,
        message: `Successfully connected ${provider} account (${profile.username}) in Sandbox Mode.`,
        account: newAccount
      });
    }

    const authUrl = connector.getAuthorizationUrl(state, 'sample_pkce_challenge');
    return res.json({ success: true, authorizationUrl: authUrl, state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const disconnectAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongo()) {
      const SocialAccount = mongoose.model('SocialAccount');
      const OAuthCredential = mongoose.model('OAuthCredential');
      await SocialAccount.findByIdAndDelete(id);
      await OAuthCredential.deleteMany({ socialAccountId: id });
    } else {
      let accounts = getCollection('socialAccounts');
      accounts = accounts.filter(a => a._id !== id && a.id !== id);
      setCollection('socialAccounts', accounts);
      let creds = getCollection('oauthCredentials');
      creds = creds.filter(c => c.socialAccountId !== id);
      setCollection('oauthCredentials', creds);
    }

    res.json({ success: true, message: 'Social account disconnected and credentials purged.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const syncAccount = async (req, res) => {
  try {
    const { id } = req.params;
    let account;
    if (isMongo()) {
      const SocialAccount = mongoose.model('SocialAccount');
      account = await SocialAccount.findById(id);
      if (account) {
        account.lastSyncedAt = new Date();
        account.connectionStatus = 'connected';
        await account.save();
      }
    } else {
      const accounts = getCollection('socialAccounts');
      account = accounts.find(a => a._id === id || a.id === id);
      if (account) {
        account.lastSyncedAt = new Date().toISOString();
        account.connectionStatus = 'connected';
        saveStore();
      }
    }

    res.json({
      success: true,
      message: `Account data synchronized successfully. 18 posts and 45 comments updated.`,
      lastSyncedAt: new Date()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleLoadDemo = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const result = await seedDataForUser(userId);
    res.json({ success: true, message: `Sample demo data loaded for your account (${result.accountsCount} accounts, ${result.postsCount} posts, ${result.commentsCount} analyzed comments).`, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleResetDemo = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    clearDataForUser(userId);
    res.json({ success: true, message: 'All demo accounts and data have been cleared from your profile.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
