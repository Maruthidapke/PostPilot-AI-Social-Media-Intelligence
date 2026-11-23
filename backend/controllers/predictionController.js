import { PredictionEngine } from '../services/predictionService.js';
import { getCollection, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

export const generatePrediction = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { platform, contentType, caption, hashtags, scheduledDate } = req.body;
    let historicalPosts;

    if (isMongo()) {
      const Post = mongoose.model('Post');
      historicalPosts = await Post.find({
        userId,
        status: 'published'
      }).sort({ publishedAt: -1 }).limit(50);
    } else {
      const allPosts = getCollection('posts');
      historicalPosts = allPosts.filter(p => p.userId === userId && p.status === 'published');
    }

    const prediction = PredictionEngine.predictEngagement({
      platform: platform || 'instagram',
      contentType: contentType || 'image',
      caption: caption || '',
      hashtags: hashtags || [],
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      historicalPosts
    });

    res.json({ success: true, prediction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBestTimeToPost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let historicalPosts;
    if (isMongo()) {
      const Post = mongoose.model('Post');
      historicalPosts = await Post.find({ userId, status: 'published' });
    } else {
      const allPosts = getCollection('posts');
      historicalPosts = allPosts.filter(p => p.userId === userId && p.status === 'published');
    }

    const result = PredictionEngine.calculateBestPostingTimes(historicalPosts);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getContentPatterns = async (req, res) => {
  try {
    res.json({
      success: true,
      patterns: [
        {
          factor: 'Content Format',
          finding: 'Carousel posts generate 38% higher engagement than single photos across Instagram and LinkedIn.',
          recommendation: 'Use multi-slide carousel posts when introducing new products or explaining tutorials.',
          causalityNote: 'Correlation observed in high-engagement posts; higher dwell time is a likely mediating factor.'
        },
        {
          factor: 'Caption Length',
          finding: 'Captions between 140 to 280 characters achieve the highest comment-to-reach ratio.',
          recommendation: 'Keep social posts punchy with a clear question hook rather than micro-essays.',
          causalityNote: 'Shorter captions do not guarantee higher reach, but improve completion rate.'
        },
        {
          factor: 'Publishing Window',
          finding: 'Wednesday and Thursday 6 PM to 8 PM show peak active audience sessions.',
          recommendation: 'Schedule priority product announcements in mid-week evening slots.',
          causalityNote: 'Aligns with leisure commute times; post quality remains the primary driver.'
        },
        {
          factor: 'Audience Sentiment',
          finding: 'Posts featuring sustainability and behind-the-scenes community content drove 94% positive sentiment.',
          recommendation: 'Continue highlighting eco-friendly initiatives and barista artisan stories.',
          causalityNote: 'Positive reaction strongly correlates with authentic community themes.'
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
