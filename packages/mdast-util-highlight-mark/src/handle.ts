import type { ConstructName, Info, State, Options } from 'mdast-util-to-markdown'
import type {
  CompileContext,
  Extension as FromMarkdownExtension,
} from 'mdast-util-from-markdown'
import type { Token } from 'micromark-util-types'
import type { Highlight, Parent } from 'mdast'

handleMark.peek = peekMark

/**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain mark highlight.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 *
 * Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
 *
 * @type {Array<ConstructName>}
 */
const constructsWithoutHighlightMark: ConstructName[] = [
  'autolink',
  'destinationLiteral',
  'destinationRaw',
  'reference',
  'titleQuote',
  'titleApostrophe',
]

/**
 * Extension for `mdast-util-from-markdown` to enable mark highlight.
 *
 * @type {FromMarkdownExtension}
 */
export const highlightMarkFromMarkdown: FromMarkdownExtension = {
  canContainEols: ['highlight'],
  enter: { highlight: enterHighlight },
  exit: { highlight: exitHighlight },
}

function enterHighlight(this: CompileContext, token: Token) {
  this.enter({ type: 'highlight', children: [] }, token)
}

function exitHighlight(this: CompileContext, token: Token) {
  this.exit(token)
}

/**
 * Extension for `mdast-util-to-markdown` to enable mark highlight.
 */
export const highlightMarkToMarkdown: Options = {
  unsafe: [
    {
      character: '=',
      inConstruct: 'phrasing',
      notInConstruct: constructsWithoutHighlightMark,
    },
  ],
  handlers: { highlight: handleMark },
}

function handleMark(node: Highlight, _: Parent | undefined, state: State, info: Info) {
  const marker = '='
  const tracker = state.createTracker(info)
  const exit = state.enter('highlight')
  let value = tracker.move(marker + marker)
  value += tracker.move(
    //@ts-expect-error ignore error
    state.containerPhrasing(node, {
      before: value,
      after: marker,
      ...tracker.current(),
    })
  )

  value += tracker.move(marker + marker)
  exit()

  return value
}

function peekMark() {
  return '='
}
