"""
PostPilot AI Python Sentiment Classifier
Multi-class sentiment inference (Positive, Neutral, Negative) with confidence calibration.
"""
import re
import math

POSITIVE_LEXICON = {
    'best', 'love', 'amazing', 'great', 'delicious', 'friendly', 'welcoming', 'inspired',
    'fresh', 'super', 'outstanding', 'premium', 'generous', 'stunning', 'perfection', 'cozy',
    'smooth', 'brilliant', 'heartwarming', 'respect', 'impressed', 'worth', 'clean', 'helpful',
    'congratulations', 'beautiful', 'wonderful', 'fast', 'mint', 'delightful', 'obsessed', 'top'
}

NEGATIVE_LEXICON = {
    'terrible', 'worst', 'horrible', 'burnt', 'rude', 'unacceptable', 'disappointed', 'disgraceful',
    'filthy', 'stale', 'awful', 'waste', 'noisy', 'overpriced', 'overhyped', 'poor', 'bitter',
    'unhygienic', 'crashed', 'broken', 'ignoring', 'ignored', 'fail', 'failed', 'double charged',
    'spilled', 'torn', 'stomach', 'expired', 'shrinkflation', 'cheat', 'scam', 'annoying'
}

NEGATION_WORDS = {
    'not', 'no', 'never', 'neither', 'hardly', 'barely', 'scarcely', "don't", "can't", "won't", "didn't", "doesn't"
}

def analyze_sentiment(text: str):
    if not text or not isinstance(text, str):
        return {
            'sentiment': 'neutral',
            'confidence': 0.85,
            'scores': {'positive': 0.1, 'neutral': 0.8, 'negative': 0.1},
            'detected_themes': []
        }

    cleaned = re.sub(r"[^\w\s#@'❤️☕🌿🙌]", ' ', text.lower())
    words = [w for w in cleaned.split() if w]

    pos_score = 0.0
    neg_score = 0.0
    has_negation = False
    has_intensifier = False

    themes = []
    if '?' in text: themes.append('Customer Question')
    if re.search(r'price|cost|charge|bill|expensive|penny', text, re.I): themes.append('Pricing & Value')
    if re.search(r'support|service|staff|manager|cashier|reply', text, re.I): themes.append('Customer Service')
    if re.search(r'taste|roast|blend|flavor|fresh|bitter|crema|brew', text, re.I): themes.append('Product Quality')
    if re.search(r'ship|shipping|package|delivery|transit|arrived', text, re.I): themes.append('Delivery & Logistics')
    if re.search(r'app|website|code|checkout|login|error', text, re.I): themes.append('Digital Experience')

    # Emoji valence
    if re.search(r'❤️|☕|🌿|🙌|🔥|✨|😍|👏', text): pos_score += 2.0
    if re.search(r'😡|👎|🤬|🤮|💔', text): neg_score += 2.5

    intensifiers = {'very', 'extremely', 'unbelievably', 'super', 'totally', 'so', 'hugely', 'truly', 'incredibly'}

    for word in words:
        if word in NEGATION_WORDS:
            has_negation = True
            continue
        if word in intensifiers:
            has_intensifier = True
            continue

        multiplier = 1.5 if has_intensifier else 1.0

        if word in POSITIVE_LEXICON:
            if has_negation:
                neg_score += 1.8 * multiplier
            else:
                pos_score += 1.5 * multiplier
            has_negation = False
            has_intensifier = False
        elif word in NEGATIVE_LEXICON:
            if has_negation:
                pos_score += 1.2 * multiplier
            else:
                neg_score += 1.8 * multiplier
            has_negation = False
            has_intensifier = False

    total = pos_score + neg_score
    if total == 0:
        p_neu, p_pos, p_neg = 0.82, 0.09, 0.09
    elif pos_score > neg_score and pos_score >= 1.2:
        p_pos = min(0.96, 0.65 + (pos_score / (total + 1.0)) * 0.3)
        p_neg = max(0.02, 0.1 * (neg_score / (total + 1.0)))
        p_neu = 1.0 - p_pos - p_neg
    elif neg_score > pos_score and neg_score >= 1.2:
        p_neg = min(0.97, 0.68 + (neg_score / (total + 1.0)) * 0.3)
        p_pos = max(0.01, 0.08 * (pos_score / (total + 1.0)))
        p_neu = 1.0 - p_pos - p_neg
    else:
        p_neu, p_pos, p_neg = 0.70, 0.15, 0.15

    final_sentiment = 'neutral'
    confidence = p_neu
    if p_pos > p_neu and p_pos > p_neg:
        final_sentiment = 'positive'
        confidence = p_pos
    elif p_neg > p_neu and p_neg > p_pos:
        final_sentiment = 'negative'
        confidence = p_neg

    return {
        'sentiment': final_sentiment,
        'confidence': round(confidence, 3),
        'scores': {
            'positive': round(p_pos, 3),
            'neutral': round(p_neu, 3),
            'negative': round(p_neg, 3)
        },
        'detected_themes': themes or ['General Feedback']
    }
