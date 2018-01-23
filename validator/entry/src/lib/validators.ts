/**
 * Created by slipkinem on 1/23/2018 at 11:18 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { $$ } from './validator'

export class ParamsConfig {
  message?: string
  otherForm?: string
  min?: number
  max?: number
}

export class ResultConfig {
  status: boolean
  message?: string
}

export type validatorFunction = (str?: string, config?: ParamsConfig) => ResultConfig

export class ValidatorsConfig {
  required: validatorFunction
  minAndMax: validatorFunction
  equalOtherValue: validatorFunction
  email: validatorFunction
  tel: validatorFunction
}

// 获取字符长度
const getCharLength = (str: string | number): number =>
    String(str)
        .trim()
        .split('')
        .map(s => s.charCodeAt(0))
        .map(n => (n < 0 || n > 255) ? 'aa' : 'a')
        .join('')
        .length

export const Validators: ValidatorsConfig = {
  required: (str = '', { message = '' } = {}) => ({
    status: getCharLength(str) !== 0,
    message
  }),
  minAndMax: (str = '', { min = 0, max = 0, message = '' } = {}) => {
    const len = getCharLength(str)

    return {
      status: len > min && len < max,
      message
    }
  },
  equalOtherValue (str = '', { otherForm = '', message = '' } = {}) {
    return {
      status: str === $$(otherForm).value,
      message
    }
  },
  email (str = '', { message = '' } = {}) {
    return {
      status: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(str),
      message
    }
  },
  tel (str = '', { message = '' } = {}) {
    return {
      status: /^1[3|4|5|7|8][0-9]{9}$/.test(str),
      message
    }
  }
}