/**
 * Created by slipkinem on 5/3/2018 at 4:41 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
export class InputStream {
  pos = 0
  line = 1
  col = 0
  input: string


  constructor (input: string) {
    this.input = input
  }

  next () {
    let ch = this.input.charAt(this.pos++)
    if (ch == '\n') {
      this.line++
      this.col = 0
    } else this.col++
    return ch
  }

  peek () {
    return this.input.charAt(this.pos)
  }

  eof () {
    return this.peek() === ''
  }

  croak (msg: string) {
    throw new Error(msg + ' (' + this.line + ':' + this.col + ')')
  }
}
