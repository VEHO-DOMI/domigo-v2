#!/bin/sh
# Vercel's Ignored Build Step: 0 skips; 1 builds (not normal success/failure).
# https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel
# Missing/unknown refs skip: an ambiguous automatic trigger must not spend a build.
# Deliberate one-off preview: Vercel deployment > Redeploy, uncheck
# "Use project's Ignore Build Step". The provider bypasses this script;
# there is deliberately no environment-variable override here.
# https://vercel.com/docs/monorepos#ignoring-the-build-step
case "${VERCEL_GIT_COMMIT_REF-}" in
  main|codex/main) exit 1 ;;
  *) exit 0 ;;
esac
