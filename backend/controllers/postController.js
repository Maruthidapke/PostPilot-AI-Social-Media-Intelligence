import { getCollection, setCollection, saveStore, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
  try {
    const { platform, status, search, accountId } = req.query;
    const userId = req.user.id || req.user._id;
    let posts;

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const query = { userId };
      if (platform && platform !== 'all') query.platform = platform;
      if (status && status !== 'all') query.status = status;
      if (accountId && accountId !== 'all') query.socialAccountId = accountId;
      if (search) query.content = { $regex: search, $options: 'i' };

      posts = await Post.find(query).sort({ createdAt: -1 });
    } else {
      let allPosts = getCollection('posts');
      posts = allPosts.filter(p => {
        if (p.userId !== userId) return false;
        if (platform && platform !== 'all' && p.platform !== platform) return false;
        if (status && status !== 'all' && p.status !== status) return false;
        if (accountId && accountId !== 'all' && p.socialAccountId !== accountId) return false;
        if (search && !((p.content || '') + (p.title || '')).toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
      // Sort newest first
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ success: true, count: posts.length, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;
    let post;
    let comments = [];

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const Comment = mongoose.model('Comment');
      post = await Post.findOne({ _id: id, userId });
      if (post) {
        comments = await Comment.find({ postId: post._id });
      }
    } else {
      const allPosts = getCollection('posts');
      const allComments = getCollection('comments');
      post = allPosts.find(p => (p._id === id || p.id === id) && p.userId === userId);
      if (post) {
        comments = allComments.filter(c => c.postId === post._id || c.postId === post.id);
      }
    }

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, post, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      platform,
      socialAccountId,
      media = [],
      hashtags = [],
      scheduledAt,
      status = 'draft'
    } = req.body;

    if (!content || !platform) {
      return res.status(400).json({ success: false, message: 'Content and platform are required.' });
    }

    const userId = req.user.id || req.user._id;
    const postStatus = scheduledAt && status !== 'draft' ? 'scheduled' : status;

    const newPostData = {
      _id: `post_${Date.now()}`,
      id: `post_${Date.now()}`,
      userId,
      socialAccountId: socialAccountId || 'acc_ig_001',
      platform,
      title: title || 'Untitled Post',
      content,
      media: media.length ? media : [{ url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', type: 'image' }],
      hashtags: hashtags.length ? hashtags : ['#postpilot', '#marketing'],
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      publishedAt: postStatus === 'published' ? new Date().toISOString() : undefined,
      status: postStatus,
      isSimulated: true,
      dataSource: 'demo_simulation',
      metricsSnapshot: {
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0
      },
      createdAt: new Date().toISOString()
    };

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const post = await Post.create(newPostData);
      return res.status(201).json({ success: true, message: 'Post created successfully', post });
    } else {
      const posts = getCollection('posts');
      posts.unshift(newPostData);
      saveStore();
      return res.status(201).json({ success: true, message: 'Post created successfully', post: newPostData });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;
    const updates = req.body;

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const post = await Post.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
      if (!post) return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
      return res.json({ success: true, post });
    } else {
      const posts = getCollection('posts');
      const index = posts.findIndex(p => (p._id === id || p.id === id) && p.userId === userId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
      posts[index] = { ...posts[index], ...updates };
      saveStore();
      return res.json({ success: true, post: posts[index] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const deleted = await Post.findOneAndDelete({ _id: id, userId });
      if (!deleted) return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
    } else {
      let posts = getCollection('posts');
      const existing = posts.find(p => (p._id === id || p.id === id) && p.userId === userId);
      if (!existing) return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
      posts = posts.filter(p => !(p._id === id || p.id === id));
      setCollection('posts', posts);
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
