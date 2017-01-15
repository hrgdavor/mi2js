# mi2js

A JS library, materializing slowly, trying to stay small.

## Guidelines
Some thoughts while making decisions in the code
 - create small and useful core
 - keep core simple, short and independent
 - remove features from the core that are not essential (obviously is influenced by personal preference)
  - aim for less code in library
  - ask: will I need this often enough (almost in every project) ?
  - ask: can it be a separate addon ?
  - split into small pieces, 
  - work later on having full build for those that do not need the hassle, and enable taking out things not needed for optimization freaks (I do that sometimes)
 - simpler code will likely have less bugs :)
 - the utilities int the lib should make resulting code simple and readable

## Code
 - clearing up the code documentation to generate nicer docs using jsdoc and also [doclets.io](https://doclets.io/hrgdavor/mi2js/master])
 - minimizer friendly 
 - avoid too short variable names ( I tend to break this one often :D ) 
 - keep code for Web Components in JS files, no coding in HTML template (error handling becomes tedious, and code that interprets it, get complicated)
 - provide means to easily pinpoint error source (not just stack trace)

## Browsers
Personally, I do not care about any browser without Flexbox support ( Flexbox not actually required by the library )
 - Issues mostly easily fixable by polyfills
 - __PhantomJS__ - polyfill for Function.bind is used
  - when printing HTML->PDF
  - testing using Karma
 - __Chrome__
 - __Firefox__ 
 - Fuck __IE__ < 11 
   - if it actually works on some old IE, zero F...s given
   - no plans to pollute library code for old browser support 
 - Likely culprits for browser problems
  - Function.bind - known issue in PhantomJS
  - Object.create
  - `hidden` attribute  - (IE <11) easily fixable with `*[hidden] { display: none; !important}` 
  - Element.firstElementChild - same as nextElementSibling, previousElementSibling 

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
