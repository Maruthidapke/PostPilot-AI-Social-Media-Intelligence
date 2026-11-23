import { InstagramConnector } from './instagramConnector.js';
import { FacebookConnector } from './facebookConnector.js';
import { LinkedInConnector } from './linkedinConnector.js';
import { TwitterConnector } from './twitterConnector.js';

export const connectors = {
  instagram: new InstagramConnector(),
  facebook: new FacebookConnector(),
  linkedin: new LinkedInConnector(),
  twitter: new TwitterConnector()
};

export const getConnector = (platform) => {
  const connector = connectors[platform.toLowerCase()];
  if (!connector) {
    throw new Error(`Unsupported social platform connector: ${platform}`);
  }
  return connector;
};
