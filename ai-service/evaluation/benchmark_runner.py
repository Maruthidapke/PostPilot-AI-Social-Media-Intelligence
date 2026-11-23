"""
PostPilot 60-Comment Ground Truth Benchmark Runner
Validates model against human annotations across positive, neutral, and negative classes.
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sentiment.classifier import analyze_sentiment

BENCHMARK_COMMENTS = [
  ("Your dark roast blend is easily the best coffee in town! Absolutely love it ❤️☕", "positive"),
  ("Super fast shipping, package arrived in mint condition. 10/10 service!", "positive"),
  ("Such inspiring content, keep up the amazing work! Looking forward to the next drop.", "positive"),
  ("The new eco-friendly packaging is a huge step forward. Great initiative! 🌿", "positive"),
  ("Visited your downtown branch yesterday and the staff was unbelievably friendly and welcoming.", "positive"),
  ("Obsessed with this oat milk latte recipe! Made it this morning and it's delicious.", "positive"),
  ("Clean aesthetic, smooth UI on your mobile ordering, really impressed with the team.", "positive"),
  ("Finally a brand that actually listens to customer feedback. Respect! 🙌", "positive"),
  ("The cold brew subscription is worth every single penny. Life saver during exams.", "positive"),
  ("Brilliant marketing campaign! The video story was genuine and heartwarming.", "positive"),
  ("Great quality beans, freshly roasted aroma fills the whole kitchen.", "positive"),
  ("Loved the workshop last weekend! Learned so much about latte art.", "positive"),
  ("Very smooth blend with zero bitter aftertaste. Truly premium.", "positive"),
  ("Customer support resolved my address change in under five minutes. Outstanding!", "positive"),
  ("Congratulations on opening the third location! You guys deserve all the success.", "positive"),
  ("The loyalty rewards program is super generous. Redeemed my free cup today!", "positive"),
  ("Can't get enough of this seasonal pumpkin spice release. Please make it permanent!", "positive"),
  ("Hands down the coziest workspace ambiance in the city. Great playlist too.", "positive"),
  ("Top tier cold brew! Recommended to all my colleagues at the office.", "positive"),
  ("Stunning photography on this post! That espresso crema looks perfection.", "positive"),

  ("What are your opening hours on national holidays?", "neutral"),
  ("Do you offer sugar-free syrup alternatives for the iced mocha?", "neutral"),
  ("Is this blend available in whole bean or only ground coffee?", "neutral"),
  ("Which roast level would you recommend for an Aeropress setup?", "neutral"),
  ("Are dogs allowed on the outdoor patio seating area?", "neutral"),
  ("Do you ship internationally to Canada or only domestic?", "neutral"),
  ("Checked the website menu yesterday, prices seem standard for specialty coffee.", "neutral"),
  ("When will the single-origin Ethiopian batch be back in stock?", "neutral"),
  ("Noticed you changed the operating hours on Google Maps.", "neutral"),
  ("Is there parking available behind the cafe or only street parking?", "neutral"),
  ("What is the caffeine content comparison between the light and dark roasts?", "neutral"),
  ("Does this merchandise tee run true to size or oversized?", "neutral"),
  ("Looking for the nutrition facts and calorie count on the almond croissants.", "neutral"),
  ("Saw the event announcement scheduled for next Friday at 6 PM.", "neutral"),
  ("Will there be decaf options available in the gift hamper bundle?", "neutral"),
  ("Ordered two bags yesterday, tracking shows in transit with postal service.", "neutral"),
  ("How long can whole beans stay fresh in the vacuum sealed pouch?", "neutral"),
  ("Is wifi provided for remote workers on weekdays?", "neutral"),
  ("Do you accept Apple Pay and contactless tap at the drive-thru counter?", "neutral"),
  ("Which distributor supplies your Colombian Supremo green beans?", "neutral"),

  ("Waited 35 minutes for a simple black coffee. Totally unacceptable service today.", "negative"),
  ("The espresso was lukewarm and tasted horribly burnt. Very disappointed.", "negative"),
  ("Terrible delivery experience. Bag was torn open and coffee spilled everywhere.", "negative"),
  ("Prices went up 20% but portion size visibly shrank. Stop the shrinkflation!", "negative"),
  ("Cashier at the counter was rude and ignored me while checking her phone.", "negative"),
  ("Your app crashed three times at checkout and double charged my credit card!", "negative"),
  ("Website keeps throwing error 500 when attempting to redeem coupon code.", "negative"),
  ("The beans were stale and roasted over 4 months ago according to the date stamp. Waste of money.", "negative"),
  ("Very noisy music playing so loud you can't even have a conversation. Awful atmosphere.", "negative"),
  ("Emailed support four days ago about missing order #4829 and zero reply so far.", "negative"),
  ("Tried the new hazelnut syrup and it has a fake chemical taste. Would not buy again.", "negative"),
  ("Restrooms were filthy and out of soap during peak lunch rush. Unhygienic.", "negative"),
  ("My subscription was supposed to be cancelled last month but got billed again!", "negative"),
  ("Waited in the drive thru line for 25 minutes only to find out oat milk was out of stock.", "negative"),
  ("Extremely bitter roast. Nothing like what the tasting notes described on the package.", "negative"),
  ("Poor customer resolution. Manager refused to refund for a wrong beverage order.", "negative"),
  ("Your promo discount code advertised in this post doesn't even work at checkout.", "negative"),
  ("Overhyped and overpriced coffee. Definitely won't be returning anytime soon.", "negative"),
  ("App won't let me log in and password reset link never arrives in email.", "negative"),
  ("Received expired almond milk in my latte. Had an upset stomach all evening. Disgraceful.", "negative")
]

def run_evaluation():
    print("=" * 65)
    print(" POSTPILOT AI: 60-COMMENT GROUND TRUTH BENCHMARK EVALUATION")
    print("=" * 65)
    correct = 0
    confusion = {
        'positive': {'positive': 0, 'neutral': 0, 'negative': 0},
        'neutral': {'positive': 0, 'neutral': 0, 'negative': 0},
        'negative': {'positive': 0, 'neutral': 0, 'negative': 0}
    }

    for text, ground_truth in BENCHMARK_COMMENTS:
        pred = analyze_sentiment(text)
        predicted_cls = pred['sentiment']
        if predicted_cls == ground_truth:
            correct += 1
        confusion[ground_truth][predicted_cls] += 1

    accuracy = (correct / len(BENCHMARK_COMMENTS)) * 100.0
    print(f"\nTotal Evaluated: {len(BENCHMARK_COMMENTS)}")
    print(f"Correct Classifications: {correct}")
    print(f"Accuracy: {accuracy:.1f}% (Required Target: >= 80.0%)")
    print(f"Success Target Met: {'YES (PASSED)' if accuracy >= 80.0 else 'NO'}\n")

    print("-" * 40)
    print("Confusion Matrix (Row=True, Col=Pred):")
    print("           Pos   Neu   Neg")
    for row in ['positive', 'neutral', 'negative']:
        print(f"True {row:4s}:  {confusion[row]['positive']:3d}   {confusion[row]['neutral']:3d}   {confusion[row]['negative']:3d}")

    print("-" * 40)
    return accuracy

if __name__ == '__main__':
    acc = run_evaluation()
    if acc < 80.0:
        sys.exit(1)
