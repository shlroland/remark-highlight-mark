export { markhighlightHtml } from './html.js'
export { markHighlight } from './syntax.js'

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    highlightSequence: 'highlightSequence'
    highlightSequenceTemporary: 'highlightSequenceTemporary'
    highlight: 'highlight'
    highlightText: 'highlightText'
  }
}
