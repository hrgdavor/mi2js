# mi2js

A JS/HMTL Component library, materializing slowly, trying to stay small by
  - adding useful features that do not require a lot of code
  - staying intentionally less advanced to reduce code-base
  - targeting back-ofice applications and not public web pages or websites to avoid many of horrible 
    requirements forced onto public web (SEO, bullshit IE browser)
  - IE shit will still mostly work, and one can use polyfills for some cases, but certainly do not intend to clog this library with IE fixes

## Guidelines
Some consideratoins (not necessarily strict rules) while making decisions in the code
  - create small and useful core
  - keep simple, short and independent
  - aim for less code in library (less bugs to make/test/fix)
  - implement/reimplement features in a way that makes application code simpler and more readable/understandable

## Guidelines and future
  - remove features that are not essential (obviously this is influenced by personal preference)
  - split into small pieces to enable custom build with specific feature-set
  - consideing moving to ES6 syntax taht is transpiled to ES5
  - considering adding type-safety support without abandoning core JavaScript tricks I like to use (better FLow support looks like good direction)
  - I like Angular approach with directives, but am not fan of switching to TypeScriupt and also not fan of bi-directional binding

## Code
 - clearing up the code documentation to generate nicer docs using jsdoc and also [doclets.io](https://doclets.io/hrgdavor/mi2js/master])
 - minimizer friendly 
 - avoid too short variable names ( I tend to break this one often :D ) 
 - keep code for Web Components in JS files, no coding in HTML template (error handling becomes tedious, and code that interprets it gets complicated and large)
 - provide means to easily pinpoint error source (not just stack trace)



## Browsers
Personally, I do not care about any browser without Flexbox support ( Flexbox is not actually required by the library )
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
