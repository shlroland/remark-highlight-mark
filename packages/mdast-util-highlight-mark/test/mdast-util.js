import assert from 'node:assert/strict'
import test from 'node:test'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { removePosition } from 'unist-util-remove-position'
import {
  highlightMarkFromMarkdown,
  highlightMarkToMarkdown,
} from '../lib/index.js'
import { highlightMark } from 'micromark-extension-highlight-mark'

test('highlightMarkFromMarkdown', () => {
  const root = fromMarkdown('a ==b== c.', {
    extensions: [highlightMark()],
    mdastExtensions: [highlightMarkFromMarkdown],
  })
  removePosition(root, { force: true })

  assert.deepEqual(
    root,
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: 'a ' },
            { type: 'highlight', children: [{ type: 'text', value: 'b' }] },
            { type: 'text', value: ' c.' },
          ],
        },
      ],
    },
    'should support highlight'
  )
  const root2 = fromMarkdown('a ==b\nc== d.', {
    extensions: [highlightMark()],
    mdastExtensions: [highlightMarkFromMarkdown],
  })
  removePosition(root2, { force: true })

  assert.deepEqual(
    root2,
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: 'a ' },
            { type: 'highlight', children: [{ type: 'text', value: 'b\nc' }] },
            { type: 'text', value: ' d.' },
          ],
        },
      ],
    },
    'should support highlight w/ eols'
  )
})

test('highlightMarkToMarkdown', () => {
  assert.deepEqual(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'a ' },
          { type: 'highlight', children: [{ type: 'text', value: 'b' }] },
          { type: 'text', value: ' c.' },
        ],
      },
      { extensions: [highlightMarkToMarkdown] }
    ),
    'a ==b== c.\n',
    'should serialize highlight'
  )

  assert.deepEqual(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'a ' },
          { type: 'highlight', children: [{ type: 'text', value: 'b\nc' }] },
          { type: 'text', value: ' d.' },
        ],
      },
      { extensions: [highlightMarkToMarkdown] }
    ),
    'a ==b\nc== d.\n',
    'should serialize strikethrough w/ eols'
  )

  assert.equal(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: '=a',
            children: [],
          },
        ],
      },
      { extensions: [highlightMarkToMarkdown] }
    ),
    '[](=a)\n',
    'should not escape equalsTo in a `destinationLiteral`'
  )

  assert.equal(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: '=a',
            children: [{ type: 'text', value: 'link text' }],
          },
        ],
      },
      { extensions: [highlightMarkToMarkdown] }
    ),
    '[link text](=a)\n',
    'should not escape equalsTo in a `destinationRaw`'
  )

  assert.equal(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {
            type: 'linkReference',
            identifier: '=a',
            referenceType: 'full',
            children: [],
          },
        ],
      },
      { extensions: [highlightMarkToMarkdown] }
    ),
    '[][=a]\n',
    'should not escape equalsTo in a `reference`'
  )

  assert.equal(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: '#',
            title: '=a',
            children: [],
          },
        ],
      },
      { extensions: [highlightMarkToMarkdown] }
    ),
    '[](# "=a")\n',
    'should not escape equalsTo in a `title` (double quotes)'
  )

  assert.equal(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: '#',
            title: '=a',
            children: [],
          },
        ],
      },
      {
        quote: "'",
        extensions: [highlightMarkToMarkdown],
      }
    ),
    "[](# '=a')\n",
    'should not escape equalsTo in a `title` (single quotes)'
  )
})
