#!/usr/bin/env python3
"""
Populate empty story entries in lessons.ts with full story text
from 100-childrens-stories.md, matched by title.
"""

import re
import sys
from pathlib import Path
from difflib import SequenceMatcher

ROOT = Path(__file__).resolve().parent.parent
STORIES_FILE = ROOT / "content" / "children-stories" / "100-childrens-stories.md"
LESSONS_FILE = ROOT / "src" / "data" / "lessons.ts"


def parse_stories(text: str) -> dict[str, str]:
    """Parse the markdown file into {normalized_title: formatted_body}."""
    # Split on `# Story N: Title`
    parts = re.split(r'^# Story \d+:\s*', text, flags=re.MULTILINE)
    header_titles = re.findall(r'^# Story \d+:\s*(.+)$', text, flags=re.MULTILINE)

    stories: dict[str, str] = {}
    for title_raw, body in zip(header_titles, parts[1:]):
        title_clean = title_raw.strip()
        body = body.strip()

        # The first line is the title text (remainder after splitting on `# Story N: `)
        # Remove it, then remove > tagline lines and leading blank lines
        lines = body.split('\n')
        filtered: list[str] = []
        skip_header = True
        past_tagline = False
        for line in lines:
            if skip_header:
                # Skip the title line (first non-empty line)
                if line.strip():
                    skip_header = False
                    continue  # skip the title line itself
                continue  # skip leading blank lines
            if not past_tagline:
                if line.startswith('>'):
                    continue
                if line.strip() == '' and not filtered:
                    continue
                past_tagline = True
            filtered.append(line)

        body = '\n'.join(filtered)

        # Convert ## headings to **bold** on own line
        body = re.sub(r'^## (.+)$', r'**\1**', body, flags=re.MULTILINE)

        # Strip trailing --- separator and whitespace
        body = re.sub(r'\n---\s*$', '', body).rstrip()

        # Store with normalized title as key
        norm = normalize_title(title_clean)
        stories[norm] = body

    return stories


def normalize_title(title: str) -> str:
    """Normalize a title for fuzzy matching: lowercase, strip subtitles, punctuation."""
    # Remove subtitle parts like " — A Karbi Story", " — A Naga Folktale"
    title = re.sub(r'\s*[—–-]+\s*A\s+\w+.*$', '', title, flags=re.IGNORECASE)
    # Remove common trailing qualifiers
    title = re.sub(r'\s*[—–-]+\s*.*$', '', title)
    # Lowercase and strip extra whitespace
    title = title.lower().strip()
    # Normalize unicode quotes/dashes
    title = title.replace('\u2019', "'").replace('\u2018', "'")
    title = title.replace('\u201c', '"').replace('\u201d', '"')
    return title


def best_match(target: str, candidates: dict[str, str], threshold: float = 0.6) -> str | None:
    """Find the best matching key in candidates for the target title."""
    target_norm = normalize_title(target)

    # Try exact match first
    if target_norm in candidates:
        return target_norm

    # Fuzzy match
    best_key = None
    best_score = 0.0
    for key in candidates:
        score = SequenceMatcher(None, target_norm, key).ratio()
        if score > best_score:
            best_score = score
            best_key = key
    if best_score >= threshold:
        return best_key
    return None


def main():
    stories_text = STORIES_FILE.read_text(encoding='utf-8')
    lessons_text = LESSONS_FILE.read_text(encoding='utf-8')

    stories = parse_stories(stories_text)
    print(f"Parsed {len(stories)} stories from source file")

    # Find all empty content entries: content: ''
    # Pattern: content: '' (possibly with different quotes)
    pattern = re.compile(
        r"""(story:\s*\{\s*title:\s*(?:'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"),\s*tagline:\s*(?:'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"),\s*content:\s*)''\s*(\})"""
    )

    matches_found = 0
    matches_filled = 0
    not_found = []

    def replacer(m):
        nonlocal matches_found, matches_filled
        matches_found += 1
        # Extract title from either single or double quoted group
        title = m.group(2) if m.group(2) is not None else m.group(3)
        # Unescape the title
        title = title.replace("\\'", "'").replace('\\"', '"')

        matched_key = best_match(title, stories)
        if matched_key is None:
            not_found.append(title)
            return m.group(0)  # Return unchanged

        story_body = stories[matched_key]

        # Escape backticks in story text (there shouldn't be any, but just in case)
        story_body = story_body.replace('`', '\\`')
        # Escape ${...} template literal expressions
        story_body = story_body.replace('${', '\\${')

        matches_filled += 1
        # Replace content: '' } with content: `...` }
        return f"{m.group(1)}`\n{story_body}` {m.group(4)}"

    new_text = pattern.sub(replacer, lessons_text)

    if matches_filled > 0:
        LESSONS_FILE.write_text(new_text, encoding='utf-8')
        print(f"Filled {matches_filled} of {matches_found} empty story entries")
    else:
        print("No entries were filled!")

    if not_found:
        print(f"\nCould not match {len(not_found)} titles:")
        for t in not_found:
            print(f"  - {t}")

    # Verify remaining empty entries
    remaining = new_text.count("content: ''")
    print(f"\nRemaining empty content entries: {remaining}")


if __name__ == '__main__':
    main()
