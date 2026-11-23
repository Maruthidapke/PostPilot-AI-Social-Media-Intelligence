"""
PostPilot AI Python Inference Microservice
Listens on port 8000 and serves real-time sentiment and engagement predictions.
"""
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from sentiment.classifier import analyze_sentiment
from prediction.regressor import EngagementRegressor

PORT = int(os.environ.get('PORT', 8000))

class AIRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path in ('/', '/health'):
            self._send_json(200, {
                'status': 'healthy',
                'service': 'PostPilot AI Python Inference Microservice',
                'version': '1.0.0',
                'models': ['CardiffNLP-Calibrated-Sentiment', 'RF-Engagement-Regressor-v1.4']
            })
        else:
            self._send_json(404, {'error': 'Not Found'})

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(length) if length > 0 else b'{}'
        try:
            body = json.loads(raw_body.decode('utf-8'))
        except Exception:
            body = {}

        if self.path == '/sentiment':
            text = body.get('text', '')
            res = analyze_sentiment(text)
            self._send_json(200, {'success': True, 'result': res})
        elif self.path == '/predict':
            platform = body.get('platform', 'instagram')
            content_type = body.get('contentType', 'image')
            caption = body.get('caption', '')
            hashtags = body.get('hashtags', [])
            mean = float(body.get('historicalMean', 240.0))
            pred = EngagementRegressor.predict(
                platform=platform,
                content_type=content_type,
                caption=caption,
                hashtags=hashtags,
                historical_mean=mean
            )
            self._send_json(200, {'success': True, 'prediction': pred})
        else:
            self._send_json(404, {'error': 'Unknown endpoint'})

def run(port=PORT):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AIRequestHandler)
    print(f"\x1b[32m✔ PostPilot Python AI Inference Service listening on port {port}\x1b[0m")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run()
