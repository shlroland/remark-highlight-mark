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
    mark: Highlight
  }

  interface PhrasingContentMap {
    mark: Highlight
  }

  interface RootContentMap {
    mark: Highlight
  }
}

export { highlightMarkFromMarkdown , highlightMarkToMarkdown } from './handle.js'
