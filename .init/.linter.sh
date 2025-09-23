#!/bin/bash
cd /home/kavia/workspace/code-generation/sri-lanka-multi-tenant-accounting-suite-8192-8030/accounting_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

