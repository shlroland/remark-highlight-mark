import './micromark.js'
import './mdast-util.js'
import assert from 'node:assert/strict'
import test from 'node:test'

test('core import', async () => {
  assert.deepEqual(
    Object.keys(await import('../lib/index.js')).sort(),
    [
      'default',
      'highlightMark',
      'highlightMarkFromMarkdown',
      'highlightMarkToMarkdown',
      'highlightMarkHtml',
    ],
    'should expose the public api',
  )
})
