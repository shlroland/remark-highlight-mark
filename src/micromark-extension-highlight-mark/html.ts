import type { HtmlExtension } from 'micromark-util-types'

/**
 * Extension for `micromark` that can be passed in `htmlExtensions`, to
 * support highlight mark when serializing to HTML.
 */
export const highlightMarkHtml: HtmlExtension = {
  enter: {
    highlight() {
      this.tag('<mark>')
    },
  },
  exit: {
    highlight() {
      this.tag('</mark>')
    },
  },
}
