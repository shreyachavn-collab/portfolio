from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
import sqlite3, os, json
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_PATH = os.path.join(BASE_DIR, 'portfolio.db')
UPLOADS = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOADS, exist_ok=True)

DEFAULT_DATA = {
  "about": {
    "name": "Shreya Chavan",
    "title": "BSc Computer Science · MSc (ongoing) in Data Science",
    "bio": "Hello — I'm Shreya, a fresher in data science with a BSc in Computer Science. I'm passionate about data, machine learning, and building useful products.",
    "profilePic": "/assets/profile.svg",
  },
  "resumeUrl": "resume.html",
  "experience": [],
  "projects": [
    {"id": 1, "title": "Sample Project 1", "description": "A demo project showcasing skills in data analysis.", "link": "#"}
  ],
  "skills": ["Python","Pandas","NumPy","Machine Learning","Data Visualization","JavaScript","HTML","CSS"],
  "certifications": [{"id":1, "name":"Intro to Data Science - Example"}],
  "socials": {"linkedin":"https://linkedin.com/","github":"https://github.com/","instagram":"https://instagram.com/","twitter":"https://twitter.com/"}
}

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
CORS(app)

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS portfolio (id INTEGER PRIMARY KEY, data TEXT)''')
    cur.execute('SELECT COUNT(*) as c FROM portfolio')
    r = cur.fetchone()
    if r['c'] == 0:
        cur.execute('INSERT INTO portfolio (id, data) VALUES (1, ?)', (json.dumps(DEFAULT_DATA),))
        conn.commit()
    conn.close()

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('SELECT data FROM portfolio WHERE id=1')
    row = cur.fetchone()
    conn.close()
    if not row:
        return jsonify(DEFAULT_DATA)
    try:
        return jsonify(json.loads(row['data']))
    except Exception:
        return jsonify(DEFAULT_DATA)

@app.route('/api/portfolio', methods=['PUT','POST'])
def save_portfolio():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error':'invalid json'}), 400
        conn = get_conn()
        cur = conn.cursor()
        cur.execute('REPLACE INTO portfolio (id, data) VALUES (1, ?)', (json.dumps(data),))
        conn.commit()
        conn.close()
        return jsonify({'ok':True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error':'no file'}), 400
    f = request.files['file']
    if f.filename == '':
        return jsonify({'error':'empty filename'}), 400
    fname = secure_filename(f.filename)
    dest = os.path.join(UPLOADS, fname)
    f.save(dest)
    url = f'/uploads/{fname}'
    return jsonify({'url': url})

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOADS, filename)

# serve index and other static assets
@app.route('/', defaults={'path':'index.html'})
@app.route('/<path:path>')
def static_proxy(path):
    full = os.path.join(BASE_DIR, path)
    if os.path.isfile(full):
        return send_from_directory(BASE_DIR, path)
    return abort(404)

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
