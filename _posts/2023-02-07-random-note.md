---
title: "Random note: 2023-02-07"
date: 2023-02-07
categories: note
---

Updated: <time>2023-02-12</time>

I've been creating some sample apps that demonstrates Web API's canvas, and decided to make some notes when I find useful information or come up with a nice idea.

## General format of description

Descriptions always end with a period, e.g. `@param {string} name - Name of the account.`.

## Markdown

- Use `>` for quotations instead of using `<q>` elements.
- When you need to escape special characters, try using [Markdown's escaping][md-escape] first.
- Identifiers for links can be named with the prefix <code><var>SITE_NAME</var>--</code>, e.g. <code>[mdn--some-api]</code>.

<!-- References -->
[md-escape]: https://www.markdownguide.org/basic-syntax/#escaping-characters

## Useful articles that may be difficult to find

+ [Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
+ [Spread syntax (...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
+ [UTF-16 characters, Unicode codepoints, and grapheme clusters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_codepoints_and_grapheme_clusters)

## Using JavaScript modules

See [JavaScript modules \| MDN][mdn--js-modules] and [Use JSDoc: ES 2015 Modules][js-doc--module].

<!-- References -->
[mdn--js-modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[js-doc--module]: https://jsdoc.app/howto-es2015-modules.html

## JSDoc

The supported JSDoc annotations in Visual Studio Code are described in [a TypeScript's page][ts--js-doc] (cf. [Visual Studio Code's documentation][vs-code--js-doc-annotations]).

According to [Google Style Guides][gs--js-doc],

> JSDoc is written in Markdown, though it may include HTML when necessary.

> Line-wrapped block tags are indented four spaces.

> Return type may be omitted if the function has no non-empty return statements.

> When using a function type expression, always specify the return type explicitly. Otherwise the default return type is "unknown (?)", which leads to strange and unexpected behavior, and is rarely what is actually desired.

> ``` js
> /**
>  * @param {function(): *} inputFunction1 Can return any type.
>  * @param {function(): undefined} inputFunction2 Definitely doesn't return
>  *      anything.
>  * NOTE: the return type of `foo` itself is safely implied to be {undefined}.
>  */
> function foo(inputFunction1, inputFunction2) {...}
> ```

Here are my own styles that conflicts with Google Style Guides:

- When using `@param`, insert a hyphen after the variable's name.
- I use bare module names, which conflicts with [the "Imports" section of Google Style Guides][gs--import]. However, VS Code's IntelliSense doesn't recognize symbols defined in external modules specified with a bare name. So in order to use IntelliSense on those external symbols, you need to import them specifying their URI during development, then rewrite bare module names again.
- I don't declare an actual variable for `@typedef` instead add name in the JSDoc comment like `@typedef {function(number): number} Generator`, which conflicts with the ["Enum and typedef comments" section of Google Style Guides][gs--typedef].

<!-- References -->
[ts--js-doc]: https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc
[vs-code--js-doc-annotations]: https://code.visualstudio.com/docs/nodejs/working-with-javascript
[gs--js-doc]: https://google.github.io/styleguide/jsguide.html#jsdoc
[gs--import]: https://google.github.io/styleguide/jsguide.html#es-module-imports
[gs--typedef]: https://google.github.io/styleguide/jsguide.html#jsdoc-enum-and-typedef-comments
