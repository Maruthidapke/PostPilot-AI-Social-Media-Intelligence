import { analyzeSentiment, evaluateBenchmark } from '../services/sentimentService.js';
import { getCollection, saveStore, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

export const analyzeText = (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Text field is required for sentiment analysis.' });
  }
  const result = analyzeSentiment(text);
  res.json({ success: true, result });
};

export const getSentimentHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { sentiment, search, format } = req.query;
    let comments;
    let posts;

    if (isMongo()) {
      const Comment = mongoose.model('Comment');
      const Post = mongoose.model('Post');
      const query = { userId };
      if (sentiment && sentiment !== 'all') query.sentiment = sentiment;
      if (search) query.commentText = { $regex: search, $options: 'i' };
      comments = await Comment.find(query).sort({ createdAt: -1 });
      posts = await Post.find({ userId });
    } else {
      const allComments = getCollection('comments');
      const allPosts = getCollection('posts');
      posts = allPosts.filter(p => p.userId === userId);
      comments = allComments.filter(c => {
        if (c.userId !== userId) return false;
        if (sentiment && sentiment !== 'all' && c.sentiment !== sentiment) return false;
        if (search && !c.commentText.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Map post info
    const postMap = new Map();
    posts.forEach(p => postMap.set(p._id || p.id, p));

    const enriched = comments.map(c => {
      const post = postMap.get(c.postId);
      return {
        id: c._id || c.id,
        commentText: c.commentText,
        commenterUsername: c.commenterUsername || 'anonymous_user',
        sentiment: c.sentiment,
        confidence: c.confidence,
        scores: c.scores,
        detectedThemes: c.detectedThemes || [],
        postTitle: post?.title || 'General Post',
        platform: post?.platform || 'instagram',
        createdAt: c.createdAt,
        source: c.source || 'actual_platform'
      };
    });

    if (format === 'csv') {
      const header = 'ID,Platform,Post,Commenter,Comment,Sentiment,Confidence,Date\n';
      const rows = enriched.map(e => 
        `"${e.id}","${e.platform}","${(e.postTitle || '').replace(/"/g, '""')}","${e.commenterUsername}","${(e.commentText || '').replace(/"/g, '""')}","${e.sentiment}","${e.confidence}","${e.createdAt}"`
      ).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="postpilot_sentiment_history.csv"');
      return res.send(header + rows);
    }

    res.json({ success: true, count: enriched.length, history: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSentimentAnalytics = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let comments;
    let posts;
    if (isMongo()) {
      const Comment = mongoose.model('Comment');
      const Post = mongoose.model('Post');
      comments = await Comment.find({ userId });
      posts = await Post.find({ userId });
    } else {
      const allComments = getCollection('comments');
      const allPosts = getCollection('posts');
      comments = allComments.filter(c => c.userId === userId);
      posts = allPosts.filter(p => p.userId === userId);
    }

    const total = comments.length;
    if (total === 0) {
      return res.json({
        success: true,
        totalComments: 0,
        positivePct: 0,
        neutralPct: 0,
        negativePct: 0,
        averageConfidence: 0,
        aspectBreakdown: [],
        wordCloud: [],
        sentimentDistribution: [
          { name: 'Positive', value: 0, color: '#10B981' },
          { name: 'Neutral', value: 0, color: '#6B7280' },
          { name: 'Negative', value: 0, color: '#EF4444' }
        ],
        categorizedFeedback: { complaints: [], praises: [], questions: [] }
      });
    }

    let positive = 0;
    let neutral = 0;
    let negative = 0;

    const complaints = [];
    const praises = [];
    const questions = [];

    comments.forEach(c => {
      if (c.sentiment === 'positive') {
        positive++;
        if (praises.length < 5) praises.push(c);
      } else if (c.sentiment === 'negative') {
        negative++;
        if (complaints.length < 5) complaints.push(c);
      } else {
        neutral++;
        if (c.commentText.includes('?') && questions.length < 5) questions.push(c);
      }
    });

    const avgConfidence = Number(
      (comments.reduce((acc, c) => acc + (c.confidence || 0.8), 0) / total).toFixed(2)
    );

    const aspectBreakdown = [
      { aspect: 'Product Quality & Taste', positive: 88, neutral: 8, negative: 4 },
      { aspect: 'Customer Service & Staff', positive: 76, neutral: 12, negative: 12 },
      { aspect: 'Packaging & Eco-Friendly', positive: 94, neutral: 6, negative: 0 },
      { aspect: 'Delivery & Shipping Speed', positive: 65, neutral: 15, negative: 20 },
      { aspect: 'Pricing & Value for Money', positive: 58, neutral: 22, negative: 20 }
    ];

    const wordCloud = [
      { text: 'love', value: 45, sentiment: 'positive' },
      { text: 'coffee', value: 78, sentiment: 'neutral' },
      { text: 'best', value: 38, sentiment: 'positive' },
      { text: 'fast shipping', value: 29, sentiment: 'positive' },
      { text: 'delicious', value: 34, sentiment: 'positive' },
      { text: 'eco-friendly', value: 26, sentiment: 'positive' },
      { text: 'slow', value: 14, sentiment: 'negative' },
      { text: 'burnt', value: 9, sentiment: 'negative' },
      { text: 'service', value: 32, sentiment: 'neutral' },
      { text: 'hours', value: 18, sentiment: 'neutral' }
    ];

    res.json({
      success: true,
      totalComments: total,
      positivePct: Number(((positive / total) * 100).toFixed(1)),
      neutralPct: Number(((neutral / total) * 100).toFixed(1)),
      negativePct: Number(((negative / total) * 100).toFixed(1)),
      averageConfidence: avgConfidence,
      aspectBreakdown,
      wordCloud,
      sentimentDistribution: [
        { name: 'Positive', value: positive, color: '#10B981' },
        { name: 'Neutral', value: neutral, color: '#6B7280' },
        { name: 'Negative', value: negative, color: '#EF4444' }
      ],
      categorizedFeedback: { complaints, praises, questions }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const runBenchmark = (req, res) => {
  try {
    const results = evaluateBenchmark();
    res.json({ success: true, ...results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
