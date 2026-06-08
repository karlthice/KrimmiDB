from flask import Flask, jsonify, request, render_template, Response
import json
from datetime import datetime

from database import get_db, init_db

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


# ── Books ────────────────────────────────────────────────────────────────

@app.route("/api/books", methods=["GET"])
def get_books():
    conn = get_db()
    rows = conn.execute("SELECT * FROM book ORDER BY id DESC").fetchall()
    conn.close()
    books = [dict(r) for r in rows]
    return jsonify({"Books": books, "Error": ""})


@app.route("/api/books/<int:book_id>", methods=["GET"])
def get_single_book(book_id):
    conn = get_db()
    rows = conn.execute("SELECT * FROM book WHERE id = ?", (book_id,)).fetchall()
    conn.close()
    books = [dict(r) for r in rows]
    return jsonify({"Book": books, "Error": ""})


@app.route("/api/books", methods=["POST"])
def insert_update_book():
    d = request.get_json()
    conn = get_db()
    now = datetime.now().isoformat()

    if not d.get("id"):
        conn.execute(
            """INSERT INTO book (bookid, caption, author, language, description,
               location, locationgps, difficulty, question1, question2, question3,
               answer1, answer2, answer3, congratulations, music, cover, helpcaption, updated)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                d.get("bookid", ""), d.get("caption", ""), d.get("author", ""),
                d.get("language", ""), d.get("description", ""), d.get("location", ""),
                d.get("locationgps", ""), d.get("difficulty", ""),
                d.get("question1", ""), d.get("question2", ""), d.get("question3", ""),
                d.get("answer1", ""), d.get("answer2", ""), d.get("answer3", ""),
                d.get("congratulations", ""), d.get("music", ""), d.get("cover", ""),
                d.get("helpcaption", ""), now,
            ),
        )
    else:
        conn.execute(
            """UPDATE book SET bookid=?, caption=?, author=?, language=?, description=?,
               location=?, locationgps=?, difficulty=?, question1=?, question2=?, question3=?,
               answer1=?, answer2=?, answer3=?, congratulations=?, music=?, cover=?,
               helpcaption=?, updated=?
               WHERE id=?""",
            (
                d.get("bookid", ""), d.get("caption", ""), d.get("author", ""),
                d.get("language", ""), d.get("description", ""), d.get("location", ""),
                d.get("locationgps", ""), d.get("difficulty", ""),
                d.get("question1", ""), d.get("question2", ""), d.get("question3", ""),
                d.get("answer1", ""), d.get("answer2", ""), d.get("answer3", ""),
                d.get("congratulations", ""), d.get("music", ""), d.get("cover", ""),
                d.get("helpcaption", ""), now, d["id"],
            ),
        )
    conn.commit()
    conn.close()
    return jsonify("1")


@app.route("/api/books/<int:book_id>/copy", methods=["POST"])
def copy_book(book_id):
    conn = get_db()
    try:
        book = conn.execute("SELECT * FROM book WHERE id = ?", (book_id,)).fetchone()
        if not book:
            return jsonify({"Error": "Book not found"})

        cur = conn.execute(
            """INSERT INTO book (bookid, caption, author, language, location, locationgps,
               cover, difficulty, question1, question2, question3, answer1, answer2, answer3,
               congratulations, description, music, updated, helpcaption)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                book["bookid"], book["caption"], book["author"], book["language"],
                book["location"], book["locationgps"], book["cover"], book["difficulty"],
                book["question1"], book["question2"], book["question3"],
                book["answer1"], book["answer2"], book["answer3"],
                book["congratulations"], book["description"], book["music"],
                book["updated"], book["helpcaption"],
            ),
        )
        new_id = cur.lastrowid

        chapters = conn.execute(
            "SELECT * FROM chapter WHERE parentid = ?", (book_id,)
        ).fetchall()
        for ch in chapters:
            conn.execute(
                """INSERT INTO chapter (parentid, chapterid, flagsneeded, flagsnotallowed,
                   locationtype, locationgps, locationdelta, music, caption, pretext,
                   experience, updated, helptext)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    new_id, ch["chapterid"], ch["flagsneeded"], ch["flagsnotallowed"],
                    ch["locationtype"], ch["locationgps"], ch["locationdelta"],
                    ch["music"], ch["caption"], ch["pretext"], ch["experience"],
                    ch["updated"], ch["helptext"],
                ),
            )
        conn.commit()
        return jsonify("1")
    except Exception as ex:
        return jsonify({"Error": str(ex)})
    finally:
        conn.close()


@app.route("/api/books/<int:book_id>/solution", methods=["PUT"])
def update_book_solution(book_id):
    d = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE book SET congratulations = ? WHERE id = ?",
        (d.get("solution", ""), book_id),
    )
    conn.commit()
    conn.close()
    return jsonify("1")


@app.route("/api/books/<int:book_id>/description", methods=["PUT"])
def update_book_description(book_id):
    d = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE book SET description = ? WHERE id = ?",
        (d.get("description", ""), book_id),
    )
    conn.commit()
    conn.close()
    return jsonify("1")


# ── Chapters ─────────────────────────────────────────────────────────────

def sort_chapters(chapters):
    """Sort chapters by dependency tree (flagsneeded), matching original C# logic."""
    sorted_list = []

    def sort_chapter(ch):
        for other in chapters:
            if other["flagsneeded"] == ch["chapterid"]:
                sort_chapter(other)
        sorted_list.append(ch)

    for ch in chapters:
        if not ch["flagsneeded"]:
            sort_chapter(ch)
            break

    sorted_list.reverse()
    return sorted_list


@app.route("/api/chapters/<path:book_id>", methods=["GET"])
@app.route("/api/chapters/", defaults={"book_id": ""}, methods=["GET"])
def get_chapters(book_id):
    conn = get_db()
    if book_id:
        rows = conn.execute(
            "SELECT * FROM chapter WHERE parentid = ? ORDER BY id", (book_id,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM chapter").fetchall()
    conn.close()

    chapters = []
    for r in rows:
        d = dict(r)
        if d.get("caption", "").startswith("*"):
            continue
        chapters.append(d)

    if book_id:
        chapters = sort_chapters(chapters)

    return jsonify({"Chapters": chapters, "Error": ""})


@app.route("/api/chapters", methods=["POST"])
def insert_update_chapter():
    d = request.get_json()
    conn = get_db()
    now = datetime.now().isoformat()

    if not d.get("id"):
        conn.execute(
            """INSERT INTO chapter (parentid, chapterid, caption, flagsneeded,
               flagsnotallowed, locationtype, locationgps, locationdelta,
               pretext, music, experience, helptext, updated)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                d.get("parentid"), d.get("chapterid", ""), d.get("caption", ""),
                d.get("flagsneeded", ""), d.get("flagsnotallowed", ""),
                d.get("locationtype", ""), d.get("locationgps", ""),
                d.get("locationdelta", ""), d.get("pretext", ""),
                d.get("music", ""), d.get("experience", ""),
                d.get("helptext", ""), now,
            ),
        )
    else:
        conn.execute(
            """UPDATE chapter SET parentid=?, chapterid=?, caption=?, flagsneeded=?,
               flagsnotallowed=?, locationtype=?, locationgps=?, locationdelta=?,
               pretext=?, music=?, experience=?, helptext=?, updated=?
               WHERE id=?""",
            (
                d.get("parentid"), d.get("chapterid", ""), d.get("caption", ""),
                d.get("flagsneeded", ""), d.get("flagsnotallowed", ""),
                d.get("locationtype", ""), d.get("locationgps", ""),
                d.get("locationdelta", ""), d.get("pretext", ""),
                d.get("music", ""), d.get("experience", ""),
                d.get("helptext", ""), now, d["id"],
            ),
        )
    conn.commit()
    conn.close()
    return jsonify("1")


@app.route("/api/chapters/<int:chapter_id>/text", methods=["PUT"])
def update_chapter_text(chapter_id):
    d = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE chapter SET pretext = ? WHERE id = ?",
        (d.get("pretext", ""), chapter_id),
    )
    conn.commit()
    conn.close()
    return jsonify("1")


@app.route("/api/chapters/<int:chapter_id>/help", methods=["PUT"])
def update_chapter_help(chapter_id):
    d = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE chapter SET helptext = ? WHERE id = ?",
        (d.get("help", ""), chapter_id),
    )
    conn.commit()
    conn.close()
    return jsonify("1")


# ── Export ────────────────────────────────────────────────────────────────

def build_json_export():
    conn = get_db()
    books = conn.execute("SELECT * FROM book ORDER BY id").fetchall()
    result = []
    for book in books:
        b = dict(book)
        if b.get("caption", "").startswith("*") or b.get("caption", "").startswith("+"):
            continue
        chapters = conn.execute(
            "SELECT * FROM chapter WHERE parentid = ? ORDER BY id", (b["id"],)
        ).fetchall()
        ch_list = []
        for ch in chapters:
            c = dict(ch)
            ch_list.append({
                "id": str(c["id"]),
                "ParentId": str(c["parentid"]),
                "ChapterId": c["chapterid"] or "",
                "FlagsNeeded": c["flagsneeded"] or "",
                "FlagsNotAllowed": c["flagsnotallowed"] or "",
                "LocationType": c["locationtype"] or "",
                "Location": c["locationgps"] or "",
                "LocationDelta": c["locationdelta"] or "",
                "Music": c["music"] or "",
                "Caption": c["caption"] or "",
                "PreText": c["pretext"] or "",
                "HelpText": c["helptext"] or "",
                "Experience": c["experience"] or "",
                "PostText": "",
                "Visited": False,
            })
        result.append({
            "id": str(b["id"]),
            "BookId": b["bookid"] or "",
            "Caption": b["caption"] or "",
            "Author": b["author"] or "",
            "Language": b["language"] or "",
            "Location": b["location"] or "",
            "LocationGPS": b["locationgps"] or "",
            "Cover": b["cover"] or "",
            "Cost": "0",
            "Difficulty": b["difficulty"] or "",
            "Question1": b["question1"] or "",
            "Question2": b["question2"] or "",
            "Question3": b["question3"] or "",
            "Answer1": b["answer1"] or "",
            "Answer2": b["answer2"] or "",
            "Answer3": b["answer3"] or "",
            "Congratulations": b["congratulations"] or "",
            "Description": b["description"] or "",
            "Music": b["music"] or "",
            "HelpCaption": b["helpcaption"] or "",
            "Chapters": ch_list,
        })
    conn.close()
    return result


@app.route("/api/export", methods=["GET"])
def export_json():
    data = build_json_export()
    return Response(
        json.dumps(data, ensure_ascii=False),
        mimetype="application/json",
        headers={"Content-Disposition": "attachment; filename=Books.json"},
    )


@app.route("/api/json", methods=["GET"])
def get_json():
    data = build_json_export()
    return Response(
        json.dumps(data, ensure_ascii=False),
        mimetype="application/json",
    )

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=8097, debug=True)
