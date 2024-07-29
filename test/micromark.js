import assert from 'node:assert/strict'
import test from 'node:test'
import { micromark } from 'micromark'
import {
  markhighlightHtml as html,
  markHighlight as syntax,
} from '../lib/index.js'

test('markdown -> html (micromark)', () => {
  const defaults = syntax()

  assert.deepEqual(
    micromark('a ==b==', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a <mark>b</mark></p>',
    'should support highlight w/ two equalsTo',
  )

  assert.deepEqual(
    micromark('a =b=', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a =b=</p>',
    'should not support highlight w/ one equalsTo',
  )

  assert.deepEqual(
    micromark('a ===b===', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a ===b===</p>',
    'should not support highlight w/ three equalsTo',
  )

  assert.deepEqual(
    micromark('a ===b==', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a ===b==</p>',
    'unbalanced',
  )

  assert.deepEqual(
    micromark('a \\===b== c', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a =<mark>b</mark> c</p>',
    'should support highlight w/ after an escaped equalsTo',
  )

  assert.deepEqual(
    micromark('a ==b ==c== d== e', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a <mark>b <mark>c</mark> d</mark> e</p>',
    'should support nested highlight',
  )

  assert.deepEqual(
    micromark('a ==-1== b', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a <mark>-1</mark> b</p>',
    'should open if preceded by whitespace and followed by punctuation',
  )

  assert.deepEqual(
    micromark('a ==b.== c', {
      extensions: [defaults],
      htmlExtensions: [html],
    }),
    '<p>a <mark>b.</mark> c</p>',
    'should close if preceded by punctuation and followed by whitespace',
  )
})
