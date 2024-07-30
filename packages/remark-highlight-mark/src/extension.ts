import type { Processor, Plugin } from 'unified'
import { highlightMark } from 'micromark-extension-highlight-mark'
import {
  highlightMarkFromMarkdown,
  highlightMarkToMarkdown,
} from 'mdast-util-highlight-mark'
import { add } from 'unist-util-add'
/**
 * Plugin to support mark highlight.
 *
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export const remarkHighlightMark: Plugin = function remarkHighlightMark(this: Processor) {
  const data = this.data()

  add(data, 'micromarkExtensions', highlightMark())
  add(data, 'fromMarkdownExtensions', highlightMarkFromMarkdown)
  add(data, 'toMarkdownExtensions', highlightMarkToMarkdown)
}
