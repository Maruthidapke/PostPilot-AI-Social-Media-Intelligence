import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sentiment.classifier import analyze_sentiment
from prediction.regressor import EngagementRegressor

class TestPostPilotAIService(unittest.TestCase):
    def test_positive_sentiment(self):
        res = analyze_sentiment("This artisan blend is the best coffee ever! Absolutely love it ❤️")
        self.assertEqual(res['sentiment'], 'positive')
        self.assertGreater(res['confidence'], 0.7)

    def test_negative_sentiment(self):
        res = analyze_sentiment("Terrible delivery experience, box arrived crushed and cold brew was spilled everywhere.")
        self.assertEqual(res['sentiment'], 'negative')
        self.assertGreater(res['confidence'], 0.7)

    def test_neutral_question(self):
        res = analyze_sentiment("What time does your downtown cafe open on national holidays?")
        self.assertEqual(res['sentiment'], 'neutral')
        self.assertIn('Customer Question', res['detected_themes'])

    def test_prediction_output_structure(self):
        pred = EngagementRegressor.predict(
            platform='instagram',
            content_type='carousel',
            caption='Check out our weekend brewing guide and tasting notes!',
            hashtags=['#coffee', '#specialty', '#roastery'],
            hour=18,
            day_of_week=3,
            historical_mean=250.0
        )
        self.assertIn('predicted_value', pred)
        self.assertGreater(pred['predicted_value'], 0)
        self.assertIn(pred['performance_category'], ['Low', 'Average', 'High', 'Viral'])
        self.assertGreaterEqual(pred['outperform_average_prob_pct'], 0)

if __name__ == '__main__':
    unittest.main()
