import test from 'node:test';
import assert from 'node:assert';
import { encryptToken, decryptToken } from '../utils/crypto.js';
import { analyzeSentiment, evaluateBenchmark } from '../services/sentimentService.js';
import { PredictionEngine } from '../services/predictionService.js';
import { getConnector } from '../social-connectors/index.js';

test('Security: AES-256-GCM OAuth Token Encryption & Decryption', (t) => {
  const secretToken = 'EAABwzLIXnjYBO71z...MetaLongLivedAccessToken';
  const encrypted = encryptToken(secretToken);
  assert.notStrictEqual(encrypted, secretToken, 'Token must be encrypted');
  assert.ok(encrypted.includes(':'), 'Token ciphertext format must include IV and Auth Tag');

  const decrypted = decryptToken(encrypted);
  assert.strictEqual(decrypted, secretToken, 'Decrypted token must exactly match original plaintext');
});

test('Social Connectors: Instagram Connector Sandbox Execution', async (t) => {
  const ig = getConnector('instagram');
  const authUrl = ig.getAuthorizationUrl('state_test_123');
  assert.ok(authUrl.includes('instagram_basic'), 'Auth URL must request instagram_basic scope');
  assert.ok(authUrl.includes('instagram_manage_insights'), 'Auth URL must request instagram_manage_insights scope');

  const tokenRes = await ig.exchangeCodeForToken('TEST_CODE');
  assert.ok(tokenRes.accessToken, 'Token exchange must yield an access token');

  const profile = await ig.getAccountProfile(tokenRes.accessToken);
  assert.strictEqual(profile.accountType, 'business', 'Instagram account must be business/creator');
  assert.ok(profile.followersCount > 0, 'Followers count should be present');
});

test('AI Sentiment: Lexicon-Valence Classification', (t) => {
  const pos = analyzeSentiment('Our new single-origin coffee is the best we ever roasted! Absolutely love it ❤️☕');
  assert.strictEqual(pos.sentiment, 'positive');
  assert.ok(pos.confidence > 0.7);

  const neg = analyzeSentiment('Waited 40 minutes and the espresso was completely burnt and awful service.');
  assert.strictEqual(neg.sentiment, 'negative');
  assert.ok(neg.confidence > 0.7);

  const neu = analyzeSentiment('What are your opening hours on Saturday morning?');
  assert.strictEqual(neu.sentiment, 'neutral');
  assert.ok(neu.detectedThemes.includes('Customer Question'));
});

test('AI Sentiment: 60-Comment Ground Truth Benchmark Agreement Target', (t) => {
  const benchmark = evaluateBenchmark();
  assert.strictEqual(benchmark.totalComments, 60, 'Benchmark must contain exactly 60 comments');
  assert.ok(benchmark.accuracy >= 80.0, `Benchmark accuracy (${benchmark.accuracy}%) must meet or exceed 80% target`);
  assert.strictEqual(benchmark.targetMet, true, 'targetMet flag must be true');
});

test('Predictive Analytics: Engagement Prediction Bounds & Category', (t) => {
  const historical = [
    { metricsSnapshot: { likes: 210, comments: 25 } },
    { metricsSnapshot: { likes: 260, comments: 30 } },
    { metricsSnapshot: { likes: 310, comments: 35 } },
    { metricsSnapshot: { likes: 240, comments: 20 } }
  ];

  const pred = PredictionEngine.predictEngagement({
    platform: 'instagram',
    contentType: 'carousel',
    caption: 'Discover our artisan roasting notes this weekend with a special flight tasting! ☕🌿 #coldbrew #artisan',
    hashtags: ['#coldbrew', '#artisan', '#specialty'],
    scheduledDate: new Date('2026-11-25T18:00:00Z'), // Wednesday 6 PM
    historicalPosts: historical
  });

  assert.strictEqual(pred.status, 'success');
  assert.ok(pred.predictedValue > 0);
  assert.ok(pred.expectedRange.lowerBound < pred.expectedRange.upperBound);
  assert.ok(['Low', 'Average', 'High', 'Viral'].includes(pred.performanceCategory));
  assert.ok(pred.confidence >= 0.6);
});

test('Predictive Analytics: Insufficient Historical Data Handling', (t) => {
  const pred = PredictionEngine.predictEngagement({
    historicalPosts: [{ metricsSnapshot: { likes: 50, comments: 2 } }] // Only 1 post
  });
  assert.strictEqual(pred.status, 'insufficient_data');
  assert.strictEqual(pred.predictedValue, null);
  assert.ok(pred.message.includes('Insufficient historical data'));
});

test('Predictive Analytics: 7x24 Best Time to Post Heatmap Optimization', (t) => {
  const historical = [
    { publishedAt: '2026-11-04T18:00:00Z', metricsSnapshot: { likes: 350, comments: 40 } }, // Wednesday 6 PM
    { publishedAt: '2026-11-11T18:00:00Z', metricsSnapshot: { likes: 420, comments: 50 } }, // Wednesday 6 PM
    { publishedAt: '2026-11-02T03:00:00Z', metricsSnapshot: { likes: 30, comments: 2 } }    // Monday 3 AM
  ];

  const bestTime = PredictionEngine.calculateBestPostingTimes(historical);
  assert.strictEqual(bestTime.bestSlots.length, 3, 'Must recommend top 3 publishing slots');
  assert.strictEqual(bestTime.bestSlots[0].rank, 1);
  assert.strictEqual(bestTime.heatmapGrid.length, 7, 'Grid must have 7 days');
  assert.strictEqual(bestTime.heatmapGrid[0].length, 24, 'Grid must have 24 hours per day');
});
