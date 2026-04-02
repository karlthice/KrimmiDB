"""Migrate data from Books.json (KiljaAdmin export) into SQLite."""
import json
import os
import sqlite3
from datetime import datetime

from database import DB_PATH, init_db, get_db

JSON_PATH = r"C:\src\temp\KrimmiWeb\bin\Debug\Books.json"


def migrate():
    # Remove old DB if exists
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed old {DB_PATH}")

    init_db()
    conn = get_db()
    cur = conn.cursor()

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        books = json.load(f)

    now = datetime.now().isoformat()
    book_count = 0
    chapter_count = 0

    for book in books:
        # Insert book preserving original ID
        cur.execute(
            """INSERT INTO book (id, bookid, caption, author, language, location,
               locationgps, cover, difficulty, question1, question2, question3,
               answer1, answer2, answer3, congratulations, description, music,
               updated, helpcaption)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                int(book["id"]),
                book.get("BookId", ""),
                book.get("Caption", ""),
                book.get("Author", ""),
                book.get("Language", ""),
                book.get("Location", ""),
                book.get("LocationGPS", ""),
                book.get("Cover", ""),
                book.get("Difficulty", ""),
                book.get("Question1", ""),
                book.get("Question2", ""),
                book.get("Question3", ""),
                book.get("Answer1", ""),
                book.get("Answer2", ""),
                book.get("Answer3", ""),
                book.get("Congratulations", ""),
                book.get("Description", ""),
                book.get("Music", ""),
                now,
                book.get("HelpCaption", ""),
            ),
        )
        book_count += 1

        for ch in book.get("Chapters", []):
            cur.execute(
                """INSERT INTO chapter (id, parentid, chapterid, caption,
                   flagsneeded, flagsnotallowed, locationtype, locationgps,
                   locationdelta, music, pretext, experience, updated, helptext)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    int(ch["id"]),
                    int(ch["ParentId"]),
                    ch.get("ChapterId", ""),
                    ch.get("Caption", ""),
                    ch.get("FlagsNeeded", ""),
                    ch.get("FlagsNotAllowed", ""),
                    ch.get("LocationType", ""),
                    ch.get("Location", ""),
                    ch.get("LocationDelta", ""),
                    ch.get("Music", ""),
                    ch.get("PreText", ""),
                    ch.get("Experience", ""),
                    now,
                    ch.get("HelpText", ""),
                ),
            )
            chapter_count += 1

    conn.commit()
    conn.close()
    print(f"Migration complete: {book_count} books, {chapter_count} chapters imported to {DB_PATH}")


if __name__ == "__main__":
    migrate()
