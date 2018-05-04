/**
 * Created by slipkinem on 5/3/2018 at 4:52 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { InputStream } from '../input-stream/InputStream'

export function TokenStream (input: InputStream) {
  let current = null
  let keywords = ' if then else lambda λ true false'

  return {
    next,
    peek,
    eof,
    croak: input.croak
  }

  function isKeyword (x: string) {
    return keywords.indexOf(' ' + x + ' ') >= 0
  }

  function isDigit (ch: string) {
    return /[0-9]/i.test(ch)
  }

  function isIdStart (ch: string) {
    return /[a-zλ_]/i.test(ch)
  }

  function isId (ch: string) {
    return isIdStart(ch) || '?!-<>=0123456789'.indexOf(ch) >= 0
  }

  function isOpChar (ch: string) {
    return '+-*/%=&|<>!'.indexOf(ch) >= 0
  }

  function isPunc (ch: string) {
    return ',;(){}[]'.indexOf(ch) >= 0
  }

  function isWhitepace (ch: string) {
    return ' \t\n'.indexOf(ch) >= 0
  }

  function readWhile (predicate: (ch: string) => boolean) {
    let str = ''
    while (!input.eof() && predicate(input.peek())) {
      str += input.next()
    }
    return str
  }

  function readNumber () {
    let hasDot = false
    let number = readWhile(function (ch: string) {
      if (ch === '.') {
        if (hasDot) return false
        hasDot = true
        return true
      }
      return isDigit(ch)
    })
    return {
      type: 'num',
      value: parseFloat(number)
    }
  }

  function readIdent () {
    let id = readWhile(isId)
    return {
      type: isKeyword(id) ? 'kw' : 'var',
      value: id
    }
  }

  function readEscaped (end: string) {
    let escaped = false, str = ''
    input.next()
    while (!input.eof()) {
      let ch = input.next()
      if (escaped) {
        str += ch
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === end) {
        break
      } else {
        str += ch
      }
    }
    return str
  }

  function readString () {
    return {
      type: 'str',
      value: readEscaped('"')
    }
  }

  function skipComment () {
    readWhile((ch: string) => ch !== '\n')
    input.next()
  }

  function readNext () {
    readWhile(isWhitepace)
    if (input.eof()) return null
    let ch = input.peek()
    if (ch === '#') {
      skipComment()
      return readNext()
    }
    if (ch === '"') return readString()
    if (isDigit(ch)) return readNumber()
    if (isIdStart(ch)) return readIdent()
    if (isPunc(ch)) return {
      type: 'punc',
      value: input.next()
    }
    if (isOpChar(ch)) return {
      type: 'op',
      value: readWhile(isOpChar)
    }
    input.croak('Can‘t handle character: ' + ch)
  }

  function peek () {
    return current || (current = readNext())
  }

  function next () {
    let tok = current
    current = null
    return tok || readNext()
  }

  function eof () {
    return peek() === null
  }
}