import type { Processor } from 'unified'
import {
  markHighlight,
  markHighlightFromMarkdown,
  markHighlightToMarkdown,
} from '../index.js'

/**
 * Plugin to support mark highlight.
 *
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export function remarkMarkHighlight(this: Processor) {
  const data = this.data()

  add('micromarkExtensions', markHighlight())
  add('fromMarkdownExtensions', markHighlightFromMarkdown)
  add('toMarkdownExtensions', markHighlightToMarkdown)

  function add(field: string, value: unknown) {
    // @ts-expect-error ignore types
    if (data[field]) data[field].push(value)
    // @ts-expect-error ignore types
    else data[field] = [value]
  }
}
