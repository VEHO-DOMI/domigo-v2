# CODEX DRAFT — NOT CANON

# Frozen zoo motor fixtures

These eight source files are byte-for-byte copies from the local W2 R2
workshop commit 2b2871c83da0c642a117ab0555a6fd6da76c706e. They are test inputs for PR-A;
they do not change the playable chapter, the published card catalogue, or the
production wordbank. Original source paths, byte lengths and SHA-256 hashes
are recorded in manifest.json. read-fixture.ts verifies every file it reads.

The snapshot contains only the level, cards, replay tape, policy, coverage
plan, wordbank and two original textbook transcripts needed by these tests.
No workshop logs, generated reader reports or nested patches are included.
The coverage plan retains its original source paths; the test reader resolves
them to these exact copies without rewriting the plan or its citations.

New zoo tests read this snapshot. Existing corpus-wide loading, proof and
composition checks keep reading the real repository content. The live ch01
art-continuity assertion also stays live. PR-B must separately prove the
imported real chapter; a green fixture test is never that proof.

To intentionally refresh this snapshot, review all changed source bytes and
update their hashes together. Never regenerate expected tape events merely
to make an unexplained test failure disappear.
