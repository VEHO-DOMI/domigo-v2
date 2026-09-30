#!/usr/bin/env python3
"""CODEX DRAFT — NOT CANON. Read only textbook sources named in the pinned lock.
Writes fingerprints outside the repository. Does not export document content.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--source-root', type=Path, required=True)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
target = args.out.resolve()
if target.is_relative_to(ROOT):
    parser.error('--out must be outside the product repository')
lock = json.loads((ROOT / 'content/build/sources.lock.json').read_text())
rows = []
for source in lock['sources']:
    if source['role'] not in ('sb-transcript', 'wb-transcript', 'master-list'):
        raise ValueError('Unapproved source role; review before reading')
    relative = Path(source['relPath'])
    path = (args.source_root / relative).resolve()
    if not path.is_relative_to(args.source_root.resolve()):
        raise ValueError('Source escapes the declared textbook root')
    row = {k: source[k] for k in ('relPath', 'role', 'grade')}
    row['expectedSha256'] = source['sha256']
    try:
        data = path.read_bytes()
        row.update(md5=hashlib.md5(data).hexdigest(), sha256=hashlib.sha256(data).hexdigest())
        row['status'] = 'BYTES_CONFIRMED' if row['sha256'] == source['sha256'] else 'SOURCE_DRIFT'
    except OSError as e:
        row.update(status='UNVERIFIZIERT', error=type(e).__name__, sha256=None, md5=None)
    rows.append(row)
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps({'schema': 'revision-sources@1', 'sources': rows}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'sources': len(rows), 'status': {s: sum(r['status'] == s for r in rows) for s in sorted({r['status'] for r in rows})}}))
