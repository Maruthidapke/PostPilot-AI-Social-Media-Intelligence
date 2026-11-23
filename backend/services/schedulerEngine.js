import { getCollection, saveStore, isMongo } from '../config/db.js';
import { getConnector } from '../social-connectors/index.js';
import { decryptToken } from '../utils/crypto.js';
import mongoose from 'mongoose';

/**
 * PostPilot Autonomous Post Publishing & Scheduling Daemon
 */
export class SchedulerEngine {
  constructor() {
    this.timer = null;
    this.isProcessing = false;
  }

  start(intervalMs = 10000) {
    if (this.timer) clearInterval(this.timer);
    console.log(`\x1b[36m[SchedulerEngine] Active. Checking scheduled jobs every ${intervalMs / 1000}s...\x1b[0m`);
    this.timer = setInterval(() => this.checkAndPublishDuePosts(), intervalMs);
    // Initial run immediately
    setTimeout(() => this.checkAndPublishDuePosts(), 1500);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async checkAndPublishDuePosts() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const now = new Date();

      if (isMongo()) {
        const Post = mongoose.model('Post');
        const OAuthCredential = mongoose.model('OAuthCredential');
        const duePosts = await Post.find({
          status: 'scheduled',
          scheduledAt: { $lte: now }
        });

        for (const post of duePosts) {
          await this.publishSinglePost(post, OAuthCredential);
        }
      } else {
        const posts = getCollection('posts');
        const oauthCredentials = getCollection('oauthCredentials');

        const duePosts = posts.filter(p => p.status === 'scheduled' && new Date(p.scheduledAt) <= now);
        for (const post of duePosts) {
          await this.publishSinglePostLocal(post, oauthCredentials);
        }
        if (duePosts.length > 0) {
          saveStore();
        }
      }
    } catch (err) {
      console.error('[SchedulerEngine] Error processing scheduled posts:', err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  async publishSinglePost(post, OAuthCredentialModel) {
    post.status = 'publishing';
    await post.save();

    try {
      const cred = await OAuthCredentialModel.findOne({ socialAccountId: post.socialAccountId });
      const rawToken = cred ? decryptToken(cred.encryptedAccessToken) : null;
      const connector = getConnector(post.platform);

      let pubResult;
      if (post.platform === 'instagram') {
        const imgUrl = post.media?.[0]?.url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800';
        pubResult = await connector.publishPost(
          post.socialAccountId,
          rawToken || `IG_DEMO_TOKEN_${Date.now()}`,
          { imageUrl: imgUrl, caption: post.content }
        );
      } else if (post.platform === 'facebook') {
        pubResult = await connector.publishToPage(
          post.socialAccountId,
          rawToken || `FB_DEMO_TOKEN_${Date.now()}`,
          { message: post.content }
        );
      } else if (post.platform === 'linkedin') {
        pubResult = await connector.publishPost(
          'urn:li:organization:84920194',
          rawToken || `LI_DEMO_TOKEN_${Date.now()}`,
          { text: post.content }
        );
      } else {
        pubResult = await connector.publishTweet(
          rawToken || `TW_DEMO_TOKEN_${Date.now()}`,
          { text: post.content }
        );
      }

      post.status = 'published';
      post.publishedAt = new Date();
      post.isSimulated = Boolean(pubResult.isSimulated);
      post.externalPostId = pubResult.id;
      // Initialize post baseline metrics
      post.metricsSnapshot = {
        likes: Math.floor(Math.random() * 25) + 5,
        comments: Math.floor(Math.random() * 5) + 1,
        shares: Math.floor(Math.random() * 3),
        reach: Math.floor(Math.random() * 300) + 100,
        impressions: Math.floor(Math.random() * 450) + 150,
        engagementRate: 3.2
      };
      await post.save();
      console.log(`\x1b[32m✔ [SchedulerEngine] Published post [${post._id}] on ${post.platform} (${post.isSimulated ? 'Simulated Demo' : 'Actual Live'})\x1b[0m`);
    } catch (e) {
      console.error(`[SchedulerEngine] Failed to publish post [${post._id}]:`, e.message);
      post.status = 'failed';
      await post.save();
    }
  }

  async publishSinglePostLocal(post, oauthCredentials) {
    post.status = 'publishing';
    try {
      const cred = oauthCredentials.find(c => c.socialAccountId === post.socialAccountId);
      const rawToken = cred ? decryptToken(cred.encryptedAccessToken) : null;
      const connector = getConnector(post.platform);

      let pubResult;
      if (post.platform === 'instagram') {
        pubResult = await connector.publishPost(
          post.socialAccountId,
          rawToken || `IG_DEMO_TOKEN_${Date.now()}`,
          { imageUrl: post.media?.[0]?.url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', caption: post.content }
        );
      } else if (post.platform === 'facebook') {
        pubResult = await connector.publishToPage(
          post.socialAccountId,
          rawToken || `FB_DEMO_TOKEN_${Date.now()}`,
          { message: post.content }
        );
      } else if (post.platform === 'linkedin') {
        pubResult = await connector.publishPost(
          'urn:li:organization:84920194',
          rawToken || `LI_DEMO_TOKEN_${Date.now()}`,
          { text: post.content }
        );
      } else {
        pubResult = await connector.publishTweet(
          rawToken || `TW_DEMO_TOKEN_${Date.now()}`,
          { text: post.content }
        );
      }

      post.status = 'published';
      post.publishedAt = new Date().toISOString();
      post.isSimulated = Boolean(pubResult.isSimulated);
      post.externalPostId = pubResult.id;
      post.metricsSnapshot = {
        likes: Math.floor(Math.random() * 25) + 5,
        comments: Math.floor(Math.random() * 5) + 1,
        shares: Math.floor(Math.random() * 3),
        reach: Math.floor(Math.random() * 300) + 100,
        impressions: Math.floor(Math.random() * 450) + 150,
        engagementRate: 3.4
      };
      console.log(`\x1b[32m✔ [SchedulerEngine] Published post [${post.id || post._id}] on ${post.platform} (${post.isSimulated ? 'Simulated Demo' : 'Actual Live'})\x1b[0m`);
    } catch (e) {
      console.error(`[SchedulerEngine] Failed to publish post:`, e.message);
      post.status = 'failed';
    }
  }
}

export const scheduler = new SchedulerEngine();
