import { ok as assert } from 'uvu/assert'
import { splice } from 'micromark-util-chunked'
import { classifyCharacter } from 'micromark-util-classify-character'
import { resolveAll } from 'micromark-util-resolve-all'
import { codes, constants, types } from 'micromark-util-symbol'
import type {
  Code,
  Construct,
  Effects,
  Event,
  Extension,
  State,
  Token,
  TokenizeContext,
} from 'micromark-util-types'

const HIGHLIGHT_SEQUENCE_TEMPORTARY = 'highlightSequenceTemporary'
const HIGHLIGHT_SEQUENCE = 'highlightSequence'
const HIGHLIGHT = 'highlight'
const HIGHLIGHT_TEXT = 'highlightText'

/**
 * Create an extension for `micromark` to enable highlight syntax.
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to
 *   enable highlight syntax.
 */
export function highlightMark(): Extension {
  const tokenizer = {
    name: 'highlight',
    tokenize: tokenizeHighlight,
    resolveAll: resolveAllHighlight,
  } satisfies Construct

  return {
    text: { [codes.equalsTo]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [codes.equalsTo] },
  }

  /**
   * Take events and resolve highlight.
   *
   * @type {Resolver}
   */
  function resolveAllHighlight(events: Event[], context: TokenizeContext) {
    let index = -1
    // Walk through all events.
    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === 'enter' &&
        events[index][1].type === HIGHLIGHT_SEQUENCE_TEMPORTARY &&
        events[index][1]._close
      ) {
        let open = index

        // Now walk back to find an opener.
        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === 'exit' &&
            events[open][1].type === HIGHLIGHT_SEQUENCE_TEMPORTARY &&
            events[open][1]._open &&
            // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
              events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = HIGHLIGHT_SEQUENCE
            events[open][1].type = HIGHLIGHT_SEQUENCE

            const highlight: Token = {
              type: HIGHLIGHT,
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end),
            }

            const text: Token = {
              type: HIGHLIGHT_TEXT,
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start),
            }

            // Opening.
            const nextEvents: Event[] = [
              ['enter', highlight, context],
              ['enter', events[open][1], context],
              ['exit', events[open][1], context],
              ['enter', text, context],
            ]

            const insideSpan = context.parser.constructs.insideSpan.null

            if (insideSpan) {
              // Between.
              splice(
                nextEvents,
                nextEvents.length,
                0,
                resolveAll(insideSpan, events.slice(open + 1, index), context),
              )
            }

            // Closing.
            splice(nextEvents, nextEvents.length, 0, [
              ['exit', text, context],
              ['enter', events[index][1], context],
              ['exit', events[index][1], context],
              ['exit', highlight, context],
            ])

            splice(events, open - 1, index - open + 3, nextEvents)

            index = open + nextEvents.length - 2
            break
          }
        }
      }
    }

    index = -1

    while (++index < events.length) {
      if (events[index][1].type === HIGHLIGHT_SEQUENCE_TEMPORTARY) {
        events[index][1].type = types.data
      }
    }

    return events
  }

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeHighlight(
    this: TokenizeContext,
    effects: Effects,
    ok: State,
    nok: State,
  ): State {
    const previous = this.previous
    const events = this.events
    let size = 0

    return start

    function start(code: Code) {
      assert(code === codes.equalsTo, 'expected `=`')
      if (
        previous === codes.equalsTo &&
        events[events.length - 1][1].type !== types.characterEscape
      ) {
        return nok(code)
      }

      effects.enter(HIGHLIGHT_SEQUENCE_TEMPORTARY)
      return more(code)
    }

    /** @type {State} */
    function more(code: Code) {
      const before = classifyCharacter(previous)

      if (code === codes.equalsTo) {
        // If this is the third marker, exit.
        if (size > 1) return nok(code)
        effects.consume(code)
        size++
        return more
      }

      if (size < 2) return nok(code)
      const token = effects.exit(HIGHLIGHT_SEQUENCE_TEMPORTARY)
      const after = classifyCharacter(code)
      token._open =
        !after || (after === constants.attentionSideAfter && Boolean(before))
      token._close =
        !before || (before === constants.attentionSideAfter && Boolean(after))
      return ok(code)
    }
  }
}
