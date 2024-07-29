export { highlightMarkHtml } from './html.js'
export { highlightMark } from './syntax.js'

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    highlightSequence: 'highlightSequence'
    highlightSequenceTemporary: 'highlightSequenceTemporary'
    highlight: 'highlight'
    highlightText: 'highlightText'
  }
}
