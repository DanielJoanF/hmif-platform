"""
web_fetcher.py — Scrape and clean content from USD websites.

Fetches web pages, strips unwanted HTML elements (scripts, nav, footer),
and extracts the main textual content. Results are cached to avoid
redundant requests.
"""

import requests
from bs4 import BeautifulSoup
from typing import Optional

import cache

# ============================================================
# TARGET URLS
# ============================================================

URLS = {
    "usd_main": "https://www.usd.ac.id/",
    "usd_ti": "https://web.usd.ac.id/fakultas/sainsdanteknologi/ti/",
}

# Maximum characters of web content to send to the LLM
# (prevents context overflow — ~4000 chars ≈ ~1000 tokens)
MAX_CONTENT_LENGTH = 4000

# Request timeout in seconds
REQUEST_TIMEOUT = 15

# Cache TTL for web content (10 minutes)
CACHE_TTL = 600

# User-Agent to avoid being blocked
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def _clean_html(html: str) -> str:
    """
    Parse raw HTML and extract clean text content.

    Removes:
    - <script> and <style> tags
    - <nav>, <header>, <footer> elements
    - Menu/navigation elements
    - Extra whitespace
    """
    soup = BeautifulSoup(html, "html.parser")

    # Remove unwanted tags entirely
    for tag_name in ["script", "style", "nav", "header", "footer", "noscript", "iframe"]:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    # Remove common navigation/menu elements by class or id patterns
    for element in soup.find_all(attrs={"class": lambda c: c and any(
        keyword in c.lower() for keyword in ["nav", "menu", "sidebar", "footer", "header", "breadcrumb"]
    ) if isinstance(c, str) else False}):
        element.decompose()

    for element in soup.find_all(attrs={"id": lambda i: i and any(
        keyword in i.lower() for keyword in ["nav", "menu", "sidebar", "footer", "header"]
    ) if isinstance(i, str) else False}):
        element.decompose()

    # Extract text and clean up whitespace
    text = soup.get_text(separator="\n")
    lines = [line.strip() for line in text.splitlines()]
    # Remove empty lines and very short lines (likely noise)
    lines = [line for line in lines if len(line) > 2]
    cleaned = "\n".join(lines)

    return cleaned


def fetch_url(url: str) -> Optional[str]:
    """
    Fetch a single URL, clean the HTML, and return text content.
    Uses cache to avoid repeated requests.

    Args:
        url: The URL to fetch.

    Returns:
        Cleaned text content (truncated to MAX_CONTENT_LENGTH), or None on failure.
    """
    # Check cache first
    cached = cache.get(url, ttl=CACHE_TTL)
    if cached is not None:
        print(f"[web_fetcher] Cache HIT for: {url}")
        return cached

    print(f"[web_fetcher] Fetching: {url}")

    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        response.encoding = response.apparent_encoding  # Handle encoding properly

        cleaned = _clean_html(response.text)

        # Truncate to safe length for LLM context
        if len(cleaned) > MAX_CONTENT_LENGTH:
            cleaned = cleaned[:MAX_CONTENT_LENGTH] + "\n\n[... konten dipotong untuk efisiensi ...]"

        # Cache the result
        cache.set(url, cleaned)
        print(f"[web_fetcher] Fetched & cached ({len(cleaned)} chars): {url}")

        return cleaned

    except requests.exceptions.Timeout:
        print(f"[web_fetcher] TIMEOUT: {url}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"[web_fetcher] ERROR fetching {url}: {e}")
        return None


def fetch_usd_main() -> Optional[str]:
    """Fetch content from the main USD website."""
    return fetch_url(URLS["usd_main"])


def fetch_usd_ti() -> Optional[str]:
    """Fetch content from the USD Teknik Informatika page."""
    return fetch_url(URLS["usd_ti"])


def fetch_all_sources() -> str:
    """
    Fetch content from all configured USD websites.
    Returns combined text from all sources.
    """
    parts = []

    main_content = fetch_usd_main()
    if main_content:
        parts.append(f"=== Sumber: Website Utama USD (usd.ac.id) ===\n{main_content}")

    ti_content = fetch_usd_ti()
    if ti_content:
        parts.append(f"=== Sumber: Website Prodi TI USD ===\n{ti_content}")

    if not parts:
        return ""

    return "\n\n".join(parts)


def fetch_specific_source(source: str) -> Optional[str]:
    """
    Fetch from a specific source by key name.

    Args:
        source: One of "usd_main" or "usd_ti".

    Returns:
        Cleaned text content, or None.
    """
    if source == "usd_main":
        return fetch_usd_main()
    elif source == "usd_ti":
        return fetch_usd_ti()
    else:
        print(f"[web_fetcher] Unknown source: {source}")
        return None
