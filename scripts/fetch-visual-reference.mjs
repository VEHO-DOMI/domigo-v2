#!/usr/bin/env node
/** Fetch one explicitly pinned synthetic GitHub release asset. Never selects latest. */
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {sha256,visualContract,verifyReference,referenceMetadata} from './lib/visual/reference.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),args=process.argv.slice(2),at=args.indexOf('--out');
assert(at>=0&&args[at+1],'--out requires a fresh external package directory');const out=path.resolve(args[at+1]);
assert(out!==root&&!out.startsWith(root+path.sep)&&!fs.existsSync(out),'Reference output must be new and outside repository');
const index=path.join(root,'apps/web/e2e/visual-baselines.sha256'),text=fs.readFileSync(index,'utf8'),meta=referenceMetadata(text);
assert(/^[a-zA-Z0-9._-]+$/.test(meta['release-tag']??'')&&/^[a-zA-Z0-9._-]+\.zip$/.test(meta['release-asset']??'')&&/^[a-f0-9]{40}$/.test(meta['artifact-head']??'')&&/^[a-f0-9]{64}$/.test(meta['archive-sha256']??''),'REFERENCE_PACKAGE_PIN');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fixed-visual-')),archive=path.join(temp,'reference.zip');
try {
const download=spawnSync('gh',['release','download',meta['release-tag'],'--repo','VEHO-DOMI/domigo-v2','--pattern',meta['release-asset'],'--output',archive],{stdio:'pipe'});
assert.equal(download.status,0,'REFERENCE_DOWNLOAD: pinned release asset unavailable; never auto-refresh');
const bytes=fs.readFileSync(archive);assert.equal(sha256(bytes),meta['archive-sha256'],'REFERENCE_ARCHIVE_HASH');
const extract=spawnSync('python3',['-c',`
import sys,zipfile,pathlib
archive,out=sys.argv[1:]; root=pathlib.Path(out); prefix='visual-candidate/reference/'
with zipfile.ZipFile(archive) as z:
 entries=[e for e in z.infolist() if e.filename.startswith(prefix) and not e.is_dir()]
 assert len(entries)==93, 'REFERENCE_ARCHIVE_MATRIX'
 assert len({e.filename for e in entries})==93, 'REFERENCE_ARCHIVE_DUPLICATE'
 for e in entries:
  relative=pathlib.PurePosixPath(e.filename[len(prefix):])
  assert not relative.is_absolute() and '..' not in relative.parts, 'REFERENCE_ARCHIVE_PATH'
  assert ((e.external_attr>>16)&0o170000)!=0o120000, 'REFERENCE_ARCHIVE_SYMLINK'
  target=root.joinpath(*relative.parts);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(e))
`,archive,out],{encoding:'utf8'});
assert.equal(extract.status,0,'REFERENCE_EXTRACT: '+extract.stderr);
verifyReference(out,index,visualContract(root));console.log(`Pinned reference ${meta.version}: 92 images, manifest and archive verified`);

} finally { fs.rmSync(temp,{recursive:true,force:true}); }
