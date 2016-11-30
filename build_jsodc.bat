REM install jsdoc using npm
REM npm -g install jsdoc

jsdoc -d build/doc -t ./node_modules/ink-docstrap/template -R README.md -r src 

