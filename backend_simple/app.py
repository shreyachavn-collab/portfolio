from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

app = Flask(__name__)
CORS(app)

def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY,
            about TEXT,
            educations TEXT,
            experiences TEXT,
            projects TEXT,
            social TEXT,
            resume TEXT,
            settings TEXT,
            updated_at TEXT
        )
    ''')
    conn.commit()
    cur.execute('SELECT COUNT(*) as c FROM portfolio')
    row = cur.fetchone()
    if row is None or row['c'] == 0:
        cur.execute(
            'INSERT INTO portfolio (about,educations,experiences,projects,social,resume,settings,updated_at) VALUES (?,?,?,?,?,?,?,?)',
            ('{}','[]','[]','[]','{}','{}','{}', None)
        )
        conn.commit()
    conn.close()

init_db()

SECTION_COLUMNS = {
    'about': 'about',
    'educations': 'educations',
    'experiences': 'experiences',
    'projects': 'projects',
    'social': 'social',
    'resume': 'resume',
    'settings': 'settings',
}

@app.route('/api/portfolio/health/', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/portfolio/', methods=['GET'])
def get_portfolio():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM portfolio LIMIT 1')
    row = cur.fetchone()
    conn.close()
    if not row:
        # create default
        init_db()
        data = {
            'about': {},
            'educations': [],
            'experiences': [],
            'projects': [],
            'social': {},
            'resume': {},
            'settings': {},
            'updated_at': None,
        }
        return jsonify(data)

    def _parse(v, is_list=False):
        try:
            return json.loads(v) if v is not None and v != '' else ([] if is_list else {})
        except Exception:
            return [] if is_list else {}

    resp = {
        'about': _parse(row['about'], is_list=False),
        'educations': _parse(row['educations'], is_list=True),
        'experiences': _parse(row['experiences'], is_list=True),
        'projects': _parse(row['projects'], is_list=True),
        'social': _parse(row['social'], is_list=False),
        'resume': _parse(row['resume'], is_list=False),
        'settings': _parse(row['settings'], is_list=False),
        'updated_at': row['updated_at'],
    }
    return jsonify(resp)

@app.route('/api/portfolio/update/<section>/', methods=['POST'])
def update_section(section):
    if section not in SECTION_COLUMNS:
        return jsonify({'error': 'Unknown section'}), 400
    try:
        payload = request.get_json(force=True)
    except Exception:
        return jsonify({'error': 'Invalid JSON'}), 400
    col = SECTION_COLUMNS[section]
    conn = get_conn()
    cur = conn.cursor()
    now = datetime.utcnow().isoformat() + 'Z'
    cur.execute(f'UPDATE portfolio SET {col} = ?, updated_at = ? WHERE id = 1', (json.dumps(payload), now))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'updated_at': now})

@app.route('/api/portfolio/clear/', methods=['POST'])
def clear_all():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM portfolio')
    cur.execute('INSERT INTO portfolio (about,educations,experiences,projects,social,resume,settings,updated_at) VALUES (?,?,?,?,?,?,?,?)', ('{}','[]','[]','[]','{}','{}','{}', None))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
