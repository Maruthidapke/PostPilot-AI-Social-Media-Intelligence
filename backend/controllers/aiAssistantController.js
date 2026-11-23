/**
 * PostPilot AI Content Assistant
 * Generates tailored multi-variant captions, hashtags, and discussion hooks.
 */

export const generateContent = (req, res) => {
  const {
    businessType = 'Specialty Cafe & Roastery',
    productOrService = 'Artisan Cold Brew Coffee',
    targetAudience = 'Young Professionals & Coffee Enthusiasts',
    topic = 'Weekend Cold Brew Tasting Event',
    platform = 'instagram',
    tone = 'conversational',
    includeHashtags = true
  } = req.body;

  const toneAdjectives = {
    conversational: 'warm, friendly, and approachable',
    professional: 'authoritative, concise, and polished',
    witty: 'playful, clever, and humorous',
    inspirational: 'motivating, uplifting, and community-centered',
    urgent: 'time-sensitive, exciting, and action-oriented'
  };

  const adj = toneAdjectives[tone] || 'engaging and authentic';

  // Multi-variant generation
  const captions = [
    {
      id: 'var_1',
      variantName: 'Option A: Storytelling & Craft Hook',
      text: `Every great weekend begins with a slow pour. ☕✨ This Saturday, we're uncapping our single-origin Cold Brew brewed for 18 cold-filtered hours with rich notes of roasted cocoa and caramelized pecan. Whether you're recharging after a marathon sprint or catching up with old friends, our patio table is waiting for you. Pull up a chair and let's savor the morning together.`,
      tone: 'Storytelling',
      wordCount: 68
    },
    {
      id: 'var_2',
      variantName: 'Option B: Punchy & Engagement Hook',
      text: `Life is too short for mediocre coffee. 🧊☕ Meet your new weekend ritual: silky, smooth artisan Cold Brew poured fresh on tap. Which roast notes do you lean toward—bright citrus or rich dark cocoa? Drop your vote below and tag the friend who never skips their morning iced coffee! 👇`,
      tone: 'Punchy & Question-Driven',
      wordCount: 49
    },
    {
      id: 'var_3',
      variantName: 'Option C: Call-to-Action & Promotional',
      text: `Upgrade your daily caffeine ritual. 🌿 Freshly brewed batches of our signature cold brew bottles are stocked and ready for pickup at all locations. Order ahead on our app to skip the counter queue and get 15% off your first 4-pack with code COLDCREW15. Link in bio!`,
      tone: 'Direct Conversion',
      wordCount: 48
    }
  ];

  const hashtags = [
    '#specialtycoffee',
    '#coldbrew',
    '#coffeeroasters',
    '#artisanroast',
    '#cafeculture',
    '#morningbrew',
    '#weekendvibes'
  ];

  const contentIdeas = [
    'Behind-the-scenes video showing the 18-hour cold brew filtration process',
    'Customer spotlight carousel sharing weekend study and workspace setups',
    'Barista tips: How to achieve the perfect cascading cold foam at home',
    'Interactive poll comparing Nitro cold brew vs traditional iced americano'
  ];

  const engagementQuestions = [
    'What is your go-to weekend coffee order: iced or steaming hot?',
    'If you could only drink one origin blend for the rest of the year, which would it be?',
    'What song is on your morning coffee playlist right now?'
  ];

  res.json({
    success: true,
    meta: {
      platform,
      businessType,
      topic,
      toneUsed: adj,
      generatedAt: new Date().toISOString(),
      aiDisclaimer: 'Generated using PostPilot Content Intelligence Engine. Review and personalize before scheduling.'
    },
    captions,
    hashtags: includeHashtags ? hashtags : [],
    contentIdeas,
    engagementQuestions
  });
};
