import { getCollection, saveStore, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

const PLATFORM_COLORS = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  twitter: '#000000'
};

export const getScheduledEvents = async (req, res) => {
  try {
    let posts;
    if (isMongo()) {
      const Post = mongoose.model('Post');
      posts = await Post.find({
        status: { $in: ['scheduled', 'published', 'publishing', 'failed'] }
      });
    } else {
      const allPosts = getCollection('posts');
      posts = allPosts.filter(p => ['scheduled', 'published', 'publishing', 'failed'].includes(p.status));
    }

    const events = posts.map(p => {
      const date = p.scheduledAt || p.publishedAt || p.createdAt;
      return {
        id: p._id || p.id,
        title: p.title || p.content.slice(0, 35) + '...',
        start: date,
        platform: p.platform,
        status: p.status,
        content: p.content,
        media: p.media,
        color: PLATFORM_COLORS[p.platform] || '#2563EB',
        isSimulated: p.isSimulated
      };
    });

    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const schedulePost = async (req, res) => {
  try {
    const { title, content, platform, socialAccountId, media, hashtags, scheduledAt } = req.body;
    if (!content || !platform || !scheduledAt) {
      return res.status(400).json({ success: false, message: 'Content, platform, and scheduledAt are required.' });
    }

    const userId = req.user.id || req.user._id;
    const newPost = {
      _id: `post_sched_${Date.now()}`,
      id: `post_sched_${Date.now()}`,
      userId,
      socialAccountId: socialAccountId || 'acc_ig_001',
      platform,
      title: title || 'Scheduled Post',
      content,
      media: media || [{ url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', type: 'image' }],
      hashtags: hashtags || [],
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: 'scheduled',
      isSimulated: true,
      dataSource: 'demo_simulation',
      metricsSnapshot: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0
      },
      createdAt: new Date().toISOString()
    };

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const post = await Post.create(newPost);
      return res.status(201).json({ success: true, message: 'Post successfully scheduled.', post });
    } else {
      const posts = getCollection('posts');
      posts.unshift(newPost);
      saveStore();
      return res.status(201).json({ success: true, message: 'Post successfully scheduled.', post: newPost });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const reschedulePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt } = req.body;
    if (!scheduledAt) {
      return res.status(400).json({ success: false, message: 'scheduledAt date is required.' });
    }

    if (isMongo()) {
      const Post = mongoose.model('Post');
      const post = await Post.findByIdAndUpdate(
        id,
        { scheduledAt: new Date(scheduledAt), status: 'scheduled' },
        { new: true }
      );
      return res.json({ success: true, message: 'Post rescheduled successfully', post });
    } else {
      const posts = getCollection('posts');
      const post = posts.find(p => p._id === id || p.id === id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      post.scheduledAt = new Date(scheduledAt).toISOString();
      post.status = 'scheduled';
      saveStore();
      return res.json({ success: true, message: 'Post rescheduled successfully', post });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongo()) {
      const Post = mongoose.model('Post');
      const post = await Post.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
      return res.json({ success: true, message: 'Post schedule cancelled', post });
    } else {
      const posts = getCollection('posts');
      const post = posts.find(p => p._id === id || p.id === id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      post.status = 'cancelled';
      saveStore();
      return res.json({ success: true, message: 'Post schedule cancelled', post });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
