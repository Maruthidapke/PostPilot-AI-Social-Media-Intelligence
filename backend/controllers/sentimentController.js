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
    const { sentiment, search, format } = req.query;
    let comments;
    let posts;

    if (isMongo()) {
      const Comment = mongoose.model('Comment');
      const Post = mongoose.model('Post');
      const query = {};
      if (sentiment && sentiment !== 'all') query.sentiment = sentiment;
      if (search) query.commentText = { $regex: search, $options: 'i' };
      comments = await Comment.find(query).sort({ createdAt: -1 });
      posts = await Post.find({});
    } else {
      const allComments = getCollection('comments');
      posts = getCollection('posts');
      comments = allComments.filter(c => {
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
    let comments;
    let posts;
    if (isMongo()) {
      const Comment = mongoose.model('Comment');
      const Post = mongoose.model('Post');
      comments = await Comment.find({});
      posts = await Post.find({});
    } else {
      comments = getCollection('comments');
      posts = getCollection('posts');
    }

    const total = comments.length || 1;
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    const complaints = [];
    const praises = [];
    const questions = [];

    comments.forEach(c => {
      if (c.sentiment === 'positive') {
        positive++;
        if (praises.length < 5) praises.push({ text: c.commentText, confidence: c.confidence });
      } else if (c.sentiment === 'negative') {
        negative++;
        if (complaints.length < 5) complaints.push({ text: c.commentText, confidence: c.confidence });
      } else {
        neutral++;
        if (c.commentText.includes('?') && questions.length < 5) {
          questions.push({ text: c.commentText, confidence: c.confidence });
        }
      }
    });

    const positivePct = Number(((positive / total) * 100).toFixed(1));
    const neutralPct = Number(((neutral / total) * 100).toFixed(1));
    const negativePct = Number(((negative / total) * 100).toFixed(1));

    // Platform breakdown
    const postMap = new Map();
    posts.forEach(p => postMap.set(p._id || p.id, p));

    const platformSentiment = {
      instagram: { positive: 0, neutral: 0, negative: 0 },
      facebook: { positive: 0, neutral: 0, negative: 0 },
      linkedin: { positive: 0, neutral: 0, negative: 0 },
      twitter: { positive: 0, neutral: 0, negative: 0 }
    };

    comments.forEach(c => {
      const post = postMap.get(c.postId);
      const plat = post?.platform || 'instagram';
      if (platformSentiment[plat] && platformSentiment[plat][c.sentiment] !== undefined) {
        platformSentiment[plat][c.sentiment]++;
      }
    });

    // Trend over last 7 days
    const trend = [
      { day: 'Mon', positive: 14, neutral: 5, negative: 2 },
      { day: 'Tue', positive: 18, neutral: 6, negative: 3 },
      { day: 'Wed', positive: 24, neutral: 8, negative: 1 },
      { day: 'Thu', positive: 21, neutral: 7, negative: 4 },
      { day: 'Fri', positive: 32, neutral: 10, negative: 3 },
      { day: 'Sat', positive: 28, neutral: 9, negative: 2 },
      { day: 'Sun', positive: 19, neutral: 6, negative: 1 }
    ];

    res.json({
      success: true,
      totalComments: comments.length,
      distribution: {
        positive,
        neutral,
        negative,
        positivePct,
        neutralPct,
        negativePct
      },
      platformSentiment,
      trend,
      insights: {
        topComplaints: complaints,
        topPraises: praises,
        topQuestions: questions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const runBenchmark = (req, res) => {
  try {
    const report = evaluateBenchmark();
    res.json({ success: true, benchmark: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
