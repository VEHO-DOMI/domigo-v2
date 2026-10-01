#!/usr/bin/env python3
"""CODEX DRAFT — NOT CANON. Archive must contain exactly the checked public bytes."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('solver', type=Path)
parser.add_argument('archive', type=Path)
parser.add_argument('--layout', choices=['solver', 'flat'], default='solver')
args = parser.parse_args()
nodes = list(args.solver.rglob('*'))
assert not args.solver.is_symlink(), 'DIRECTORY:ROOT_SYMLINK'
assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in nodes), 'DIRECTORY:NON_REGULAR'
directories = {str(p.relative_to(args.solver)) for p in nodes if p.is_dir()}
assert directories == ({'assets'} if any(p.is_file() and p.parent == args.solver / 'assets' for p in nodes) else set()), 'DIRECTORY:MEMBERSHIP'
prefix = 'solver/' if args.layout == 'solver' else ''
files = {str(p.relative_to(args.solver)): p for p in args.solver.rglob('*') if p.is_file()}
allowed = re.compile(r'(index\.html|manifest\.json|style\.css|p\d{3}(-s\d{2})?\.html|assets/a\d{3}\.(png|woff2))')
with zipfile.ZipFile(args.archive) as archive:
    names = archive.namelist()
    assert len(names) == len(set(names)), 'ARCHIVE:DUPLICATE'
    assert set(names) == {prefix + name for name in files}, 'ARCHIVE:MEMBERSHIP'
    for name in names:
        relative = name.removeprefix(prefix)
        assert allowed.fullmatch(relative), 'ARCHIVE:SPEAKING_OR_UNEXPECTED_NAME'
        assert archive.read(name) == files[relative].read_bytes(), 'ARCHIVE:BYTES'
print(json.dumps({'files': len(files), 'archiveSha256': hashlib.sha256(args.archive.read_bytes()).hexdigest(), 'status': 'EXACT_PUBLIC_BYTES'}))
