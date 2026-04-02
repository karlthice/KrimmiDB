import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'krimmi.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookid TEXT,
            caption TEXT,
            author TEXT,
            language TEXT,
            location TEXT,
            locationgps TEXT,
            cover TEXT,
            difficulty TEXT,
            question1 TEXT,
            question2 TEXT,
            question3 TEXT,
            answer1 TEXT,
            answer2 TEXT,
            answer3 TEXT,
            congratulations TEXT,
            description TEXT,
            music TEXT,
            updated TEXT,
            helpcaption TEXT
        );

        CREATE TABLE IF NOT EXISTS chapter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parentid INTEGER NOT NULL REFERENCES book(id),
            chapterid TEXT,
            caption TEXT,
            flagsneeded TEXT,
            flagsnotallowed TEXT,
            locationtype TEXT,
            locationgps TEXT,
            locationdelta TEXT,
            music TEXT,
            pretext TEXT,
            experience TEXT,
            updated TEXT,
            helptext TEXT
        );
    ''')
    conn.close()
