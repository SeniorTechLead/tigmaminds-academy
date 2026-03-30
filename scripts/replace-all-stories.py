#!/usr/bin/env python3
"""
Replace ALL story content in lessons.ts with full versions from
100-childrens-stories.md. This handles both empty ('') and existing
backtick-delimited content.
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
    parts = re.split(r'^# Story \d+:\s*', text, flags=re.MULTILINE)
    header_titles = re.findall(r'^# Story \d+:\s*(.+)$', text, flags=re.MULTILINE)

    stories: dict[str, str] = {}
    for title_raw, body in zip(header_titles, parts[1:]):
        title_clean = title_raw.strip()
        body = body.strip()

        lines = body.split('\n')
        filtered: list[str] = []
        skip_header = True
        past_tagline = False
        for line in lines:
            if skip_header:
                if line.strip():
                    skip_header = False
                    continue
                continue
            if not past_tagline:
                if line.startswith('>'):
                    continue
                if line.strip() == '' and not filtered:
                    continue
                past_tagline = True
            filtered.append(line)

        body = '\n'.join(filtered)
        body = re.sub(r'^## (.+)$', r'**\1**', body, flags=re.MULTILINE)
        body = re.sub(r'\n---\s*$', '', body).rstrip()

        norm = normalize_title(title_clean)
        stories[norm] = body

    return stories


def normalize_title(title: str) -> str:
    title = re.sub(r'\s*[—–-]+\s*A\s+\w+.*$', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\s*[—–-]+\s*.*$', '', title)
    title = title.lower().strip()
    title = title.replace('\u2019', "'").replace('\u2018', "'")
    title = title.replace('\u201c', '"').replace('\u201d', '"')
    return title


def best_match(target: str, candidates: dict[str, str], threshold: float = 0.6) -> str | None:
    target_norm = normalize_title(target)
    if target_norm in candidates:
        return target_norm
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


def find_backtick_end(text: str, start: int) -> int:
    """Find the closing backtick for a template literal starting at `start`.
    `start` should point to the opening backtick.
    Returns the index of the closing backtick."""
    i = start + 1  # skip opening backtick
    while i < len(text):
        ch = text[i]
        if ch == '\\':
            i += 2  # skip escaped char
            continue
        if ch == '$' and i + 1 < len(text) and text[i + 1] == '{':
            # Template expression ${...} — skip to matching }
            depth = 1
            i += 2
            while i < len(text) and depth > 0:
                if text[i] == '{':
                    depth += 1
                elif text[i] == '}':
                    depth -= 1
                elif text[i] == '\\':
                    i += 1  # skip escaped char
                i += 1
            continue
        if ch == '`':
            return i
        i += 1
    return -1


def main():
    stories_text = STORIES_FILE.read_text(encoding='utf-8')
    lessons_text = LESSONS_FILE.read_text(encoding='utf-8')

    stories = parse_stories(stories_text)
    print(f"Parsed {len(stories)} stories from source file")

    # Find each story entry pattern:
    # story: { title: 'TITLE', tagline: 'TAGLINE', content: `...` }
    # or content: '' }
    # We'll find "content: " followed by either ` or '

    # Strategy: find all "story: { title: '...'" occurrences, extract title,
    # then find the "content: " part and replace its value.

    title_pattern = re.compile(
        r"story:\s*\{\s*title:\s*'([^'\\]*(?:\\.[^'\\]*)*)'"
    )

    replaced = 0
    skipped_no_match = []
    already_full = 0
    result = lessons_text
    offset_adjust = 0  # track how replacements shift positions

    # Collect all matches first, then apply replacements from end to start
    # to avoid offset issues
    matches = list(title_pattern.finditer(lessons_text))

    # Process from last to first so offsets don't shift
    for m in reversed(matches):
        title = m.group(1).replace("\\'", "'").replace('\\"', '"')

        matched_key = best_match(title, stories)
        if matched_key is None:
            skipped_no_match.append(title)
            continue

        story_body = stories[matched_key]
        # Escape backticks and template expressions for JS template literal
        story_body = story_body.replace('\\', '\\\\')  # escape backslashes first
        story_body = story_body.replace('`', '\\`')
        story_body = story_body.replace('${', '\\${')
        # Undo double-escape of already-escaped things in source
        # Actually, the source shouldn't have backslashes that need escaping.
        # Let me reconsider: we only need to escape ` and ${ for template literals.
        # Backslashes in the story text should be kept as-is in the template literal.
        # So let's NOT escape backslashes — only backticks and ${.
        story_body = stories[matched_key]
        story_body = story_body.replace('`', '\\`')
        story_body = story_body.replace('${', '\\${')

        # Find "content: " after this match
        search_start = m.end()
        content_match = re.search(r'content:\s*', result[search_start:search_start + 500])
        if not content_match:
            print(f"  WARNING: Could not find 'content:' for '{title}'")
            continue

        content_keyword_end = search_start + content_match.end()

        # What follows content: ? Either ` (backtick) or ' (quote for empty string)
        next_char = result[content_keyword_end]

        if next_char == '`':
            # Find closing backtick
            close_idx = find_backtick_end(result, content_keyword_end)
            if close_idx == -1:
                print(f"  WARNING: Could not find closing backtick for '{title}'")
                continue
            # Replace from opening backtick to closing backtick (inclusive)
            old_content = result[content_keyword_end:close_idx + 1]
            new_content = f"`\n{story_body}`"
            result = result[:content_keyword_end] + new_content + result[close_idx + 1:]
            replaced += 1
        elif next_char == "'":
            # Empty content: ''
            # Find the closing quote
            if result[content_keyword_end:content_keyword_end + 2] == "''":
                new_content = f"`\n{story_body}`"
                result = result[:content_keyword_end] + new_content + result[content_keyword_end + 2:]
                replaced += 1
            else:
                print(f"  WARNING: Unexpected single-quote content for '{title}'")
                continue
        else:
            print(f"  WARNING: Unexpected char '{next_char}' after content: for '{title}'")
            continue

    if replaced > 0:
        LESSONS_FILE.write_text(result, encoding='utf-8')
        print(f"\nReplaced {replaced} story entries with full source text")
    else:
        print("\nNo entries were replaced!")

    if skipped_no_match:
        print(f"\nCould not match {len(skipped_no_match)} titles (no source story):")
        for t in skipped_no_match:
            print(f"  - {t}")

    # Verify: count empty content entries
    remaining_empty = result.count("content: ''")
    print(f"\nRemaining empty content entries: {remaining_empty}")

    # Verify: count all content entries and their approximate lengths
    content_pattern = re.compile(r"content:\s*`([^`]*)`", re.DOTALL)
    contents = content_pattern.findall(result)
    short_stories = [(i, len(c.strip())) for i, c in enumerate(contents) if len(c.strip()) < 100]
    print(f"Total backtick content entries: {len(contents)}")
    if short_stories:
        print(f"WARNING: {len(short_stories)} stories have very short content (<100 chars)")
        for idx, length in short_stories:
            print(f"  Entry {idx}: {length} chars")


if __name__ == '__main__':
    main()
