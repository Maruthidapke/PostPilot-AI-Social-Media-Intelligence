import mongoose from 'express'; // or mongoose
import m from 'mongoose';

const { Schema, model } = m;

// 1. User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'creator'], default: 'manager' },
  timezone: { type: String, default: 'UTC' },
  createdAt: { type: Date, default: Date.now }
});

// 2. SocialAccount Schema
const socialAccountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['instagram', 'facebook', 'linkedin', 'twitter'], required: true },
  platformAccountId: { type: String, required: true },
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  profileImage: { type: String },
  accountType: { type: String, enum: ['business', 'creator', 'page', 'profile', 'organization'], default: 'business' },
  connectionStatus: { 
    type: String, 
    enum: ['connected', 'syncing', 'permission_required', 'token_expired', 'connection_failed', 'disconnected'],
    default: 'connected'
  },
  permissions: [{ type: String }],
  isDemo: { type: Boolean, default: false },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  lastSyncedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// 3. OAuthCredential Schema (Isolated & Encrypted)
const oauthCredentialSchema = new Schema({
  socialAccountId: { type: Schema.Types.ObjectId, ref: 'SocialAccount', required: true, unique: true },
  encryptedAccessToken: { type: String, required: true },
  encryptedRefreshToken: { type: String },
  expiresAt: { type: Date },
  tokenMetadata: { type: Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now }
});

// 4. Post Schema
const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  socialAccountId: { type: Schema.Types.ObjectId, ref: 'SocialAccount', required: true },
  platform: { type: String, required: true },
  externalPostId: { type: String },
  title: { type: String },
  content: { type: String, required: true },
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video', 'carousel', 'none'], default: 'image' }
  }],
  hashtags: [{ type: String }],
  scheduledAt: { type: Date },
  publishedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled'],
    default: 'draft'
  },
  isSimulated: { type: Boolean, default: false },
  dataSource: { 
    type: String, 
    enum: ['actual_platform', 'calculated', 'ai_predicted', 'manual_import', 'demo_simulation'],
    default: 'actual_platform'
  },
  metricsSnapshot: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  },
  sentimentOverview: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 } // -1 to 1
  },
  createdAt: { type: Date, default: Date.now }
});

// 5. PostMetricSnapshot Schema
const postMetricSnapshotSchema = new Schema({
  socialAccountId: { type: Schema.Types.ObjectId, ref: 'SocialAccount', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  platform: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  recordedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'actual_platform' }
});

// 6. Comment Schema
const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  socialAccountId: { type: Schema.Types.ObjectId, ref: 'SocialAccount', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  externalCommentId: { type: String },
  commenterUsername: { type: String, default: 'anonymous_user' },
  commentText: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
  confidence: { type: Number, required: true }, // 0.0 to 1.0
  scores: {
    positive: Number,
    neutral: Number,
    negative: Number
  },
  detectedThemes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  analyzedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'actual_platform' }
});

// 7. Prediction Schema
const predictionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  socialAccountId: { type: Schema.Types.ObjectId, ref: 'SocialAccount', required: true },
  predictionType: { 
    type: String, 
    enum: ['engagement_range', 'best_time', 'performance_category', 'growth_trend'],
    required: true
  },
  predictedValue: { type: Schema.Types.Mixed, required: true },
  lowerBound: { type: Number },
  upperBound: { type: Number },
  confidence: { type: Number, required: true },
  performanceCategory: { type: String, enum: ['Low', 'Average', 'High', 'Viral'] },
  outperformAverageProb: { type: Number },
  modelVersion: { type: String, default: 'RF-v1.4-Chrono' },
  sourceDataPeriod: { type: String, default: 'Historical 30-Day Posts' },
  featuresUsed: [{ type: String }],
  generatedAt: { type: Date, default: Date.now }
});

// 8. SyncJob Schema
const syncJobSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  socialAccountId: { type: Schema.Types.ObjectId, ref: 'SocialAccount', required: true },
  jobType: { type: String, enum: ['initial', 'incremental', 'manual'], default: 'manual' },
  status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
  recordsProcessed: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  error: { type: String }
});

// Models
export const User = m.models.User || model('User', userSchema);
export const SocialAccount = m.models.SocialAccount || model('SocialAccount', socialAccountSchema);
export const OAuthCredential = m.models.OAuthCredential || model('OAuthCredential', oauthCredentialSchema);
export const Post = m.models.Post || model('Post', postSchema);
export const PostMetricSnapshot = m.models.PostMetricSnapshot || model('PostMetricSnapshot', postMetricSnapshotSchema);
export const Comment = m.models.Comment || model('Comment', commentSchema);
export const Prediction = m.models.Prediction || model('Prediction', predictionSchema);
export const SyncJob = m.models.SyncJob || model('SyncJob', syncJobSchema);
