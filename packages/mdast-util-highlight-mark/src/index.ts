// Add custom data tracked to turn a syntax tree into markdown.
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Whole m.
     *
     * ```markdown
     * > | ==a==
     *     ^^^^^
     * ```
     */
    highlight: 'highlight'
  }
}

declare module 'mdast' {
  export interface Highlight extends Parent {
    type: 'highlight'
    children: PhrasingContent[]
  }

  export interface StaticPhrasingContentMap {
    highlight: Highlight
  }

  interface PhrasingContentMap {
    highlight: Highlight
  }

  interface RootContentMap {
    highlight: Highlight
  }
}

export { highlightMarkFromMarkdown , highlightMarkToMarkdown } from './handle.js'
