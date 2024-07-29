# remark-highlight-mark

## What is this?

This package contains extensions that add support for highlight-mark(`==abc==`) to [`micromark`][micromark], [`mdast`][mdast] and [`remark`][remark].

Inspired by [`micromark-extension-gfm-strikethrough`][micromark-extension-gfm-strikethrough], [`mdast-util-gfm-strikethrough`][mdast-util-gfm-strikethrough] and [`remark-gfm`][remark-gfm]

## Install

This package is [ESM only][esm].

```sh
npm install remark-highlight-mark
```

## When to use this

This project is useful when you want to support highlight-mark(`==abc==`) in markdown.

When you need to support [`micromark`][micromark], you need to use the exported `highlightMarkHtml` and `highlightMark` from the package.

```ts
import { highlightMarkHtml, highlightMark } from 'remark-highlight-mark'

micromark('a ==b==', {
  extensions: [defaults],
  htmlExtensions: [html],
})
```

When you need to support [`mdast`][mdast], you need to use the exported `highlightMarkFromMarkdown` and `highlightMarkToMarkdown` from the package.

```ts
import { highlightMarkFromMarkdown, highlightMarkToMarkdown } from 'remark-highlight-mark'

fromMarkdown('a ==b== c.', {
  extensions: [highlightMark()],
  mdastExtensions: [highlightMarkFromMarkdown],
})

toMarkdown(
  {
    type: 'paragraph',
    children: [
      { type: 'text', value: 'a ' },
      { type: 'mark', children: [{ type: 'text', value: 'b' }] },
      { type: 'text', value: ' c.' },
    ],
  },
  { extensions: [highlightMarkToMarkdown] }
)
```

When you need to support [`remark`][remark], you need to use the exported `remarkHighlightMark`  from the package.

```ts
import { remarkHighlightMark } from 'remark-highlight-mark'

export const remark = () =>
  unified().use(remarkParse).use(remarkStringify).use(remarkGfm).use(remarkHighlightMark)

```

## HTML

When tilde sequences match, they together relate to the `<mark>` element in
HTML.
See [*§ 4.5.23 The mark element*][html-mark] in the HTML spec for more info.

## License

[MIT][license]