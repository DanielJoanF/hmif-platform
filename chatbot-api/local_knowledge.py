"""
local_knowledge.py — Load and search the local knowledge base with per-file keyword matching.

Each data file is mapped to a set of keywords. When a user asks a question,
only the files whose keywords match the query are returned as context.
This avoids sending irrelevant data to the LLM and improves answer accuracy.
"""

import os
from typing import Optional


# ============================================================
# PER-FILE KEYWORD MAPPING
# Each file in data/ is mapped to keywords that trigger its retrieval.
# This ensures only relevant context is sent to the LLM.
# ============================================================

FILE_KEYWORD_MAP: dict[str, list[str]] = {
    "hmif_profil.txt": [
        "hmif", "himpunan", "profil", "tentang", "visi", "misi",
        "organisasi", "kontak", "instagram", "email",
        "informatika", "fakultas", "sains", "teknologi",
    ],
    "hmif_pengurus.txt": [
        "pengurus", "ketua", "wakil", "sekretaris", "bendahara",
        "divisi", "struktur", "koordinator", "co ", "anggota",
        "humas", "kewirausahaan", "medkominfo", "minat", "bakat",
        "psdm", "sosial", "web holder",
        # Nama-nama pengurus (untuk pertanyaan spesifik "siapa ketua HMIF?")
        "tio alan", "tumba", "advhenita", "elvinda",
        "yoas", "rachel", "thomas paskal", "pebrianus", "gabriella nava",
        "agustinus wisik", "wilston",
        "daniel joan",
    ],
    "hmif_proker.txt": [
        "program kerja", "proker", "kegiatan hmif", "event hmif",
        "informatika belajar", "if 1", "if 2",
        "saos", "open source",
        "kunjungan perusahaan",
        "iasd", "alumni",
        "it days", "informatika days",
        "lomba", "seminar", "workshop",
    ],
    "pengumuman_prodi.txt": [
        "pengumuman", "jadwal", "uas", "ujian", "brs",
        "bimbingan rencana studi", "kuliah",
        "incasst", "expo day", "talkshow",
        "tanggal", "kapan", "deadline",
        "semester", "gasal", "genap",
    ],
    "berita_prodi.txt": [
        "berita", "pelatihan", "pengabdian", "magic school",
        "dosen", "guru", "timbulharjo",
        "dekan", "prodi informatika usd",
    ],
}


# ============================================================
# DATA STORAGE — loaded once at startup
# ============================================================

_file_contents: dict[str, str] = {}

# Path to the data directory
_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")


def load_all() -> None:
    """Load all .txt files from the data/ directory into memory."""
    global _file_contents
    _file_contents = {}

    if not os.path.isdir(_DATA_DIR):
        print(f"[local_knowledge] WARNING: data directory not found at {_DATA_DIR}")
        return

    for filename in os.listdir(_DATA_DIR):
        if filename.endswith(".txt"):
            filepath = os.path.join(_DATA_DIR, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if content:
                        _file_contents[filename] = content
                        print(f"[local_knowledge] Loaded: {filename} ({len(content)} chars)")
            except Exception as e:
                print(f"[local_knowledge] ERROR loading {filename}: {e}")

    print(f"[local_knowledge] Total files loaded: {len(_file_contents)}")

    # Warn about files not in keyword map
    for filename in _file_contents:
        if filename not in FILE_KEYWORD_MAP:
            print(f"[local_knowledge] WARNING: {filename} has no keyword mapping — it won't be searchable!")


def search(query: str) -> Optional[str]:
    """
    Search for relevant knowledge files based on keyword matching.

    Logic:
    1. For each file, check if any of its mapped keywords appear in the query.
    2. Score each file by number of keyword matches.
    3. Return content from matching files, ordered by relevance (most matches first).
    4. If no keyword matches, fall back to full-text substring search.

    Args:
        query: The user's question.

    Returns:
        Combined context string from matching files, or None if nothing matches.
    """
    query_lower = query.lower()

    # Score each file by keyword match count
    scored_files: list[tuple[str, int]] = []

    for filename, keywords in FILE_KEYWORD_MAP.items():
        if filename not in _file_contents:
            continue

        # Count how many keywords match
        match_count = sum(1 for kw in keywords if kw.lower() in query_lower)

        if match_count > 0:
            scored_files.append((filename, match_count))

    # Sort by match count (most relevant first)
    scored_files.sort(key=lambda x: x[1], reverse=True)

    if scored_files:
        parts = []
        for filename, score in scored_files:
            label = filename.replace(".txt", "").replace("_", " ").title()
            parts.append(f"=== {label} (relevansi: {score} keyword) ===\n{_file_contents[filename]}")
        print(f"[local_knowledge] Matched files: {[f for f, _ in scored_files]}")
        return "\n\n".join(parts)

    # Fallback: full-text search across all files
    # Check if any query word (>3 chars) appears in any file content
    query_words = [w for w in query_lower.split() if len(w) > 3]
    fallback_matches = []

    for filename, content in _file_contents.items():
        content_lower = content.lower()
        if any(word in content_lower for word in query_words):
            fallback_matches.append(filename)

    if fallback_matches:
        parts = []
        for filename in fallback_matches:
            label = filename.replace(".txt", "").replace("_", " ").title()
            parts.append(f"=== {label} ===\n{_file_contents[filename]}")
        print(f"[local_knowledge] Fallback matched: {fallback_matches}")
        return "\n\n".join(parts)

    print(f"[local_knowledge] No matches found for: '{query}'")
    return None


def get_all_topics() -> list[str]:
    """Return a list of all loaded file names for debugging."""
    return list(_file_contents.keys())
