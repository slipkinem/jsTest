/**
 * Created by slipkinem on 1/23/2018 at 10:42 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { ParamsConfig, Validators } from './validators'

export interface IValidatorConfig {
  error?: ($target: HTMLInputElement) => void
  success?: ($target: HTMLInputElement) => void
  reset?: (allTarget: string[]) => void
}

export class MessageConfig {
  target?: string
  placeholder?: string
  success?: string
}

export class ValidateConfig {
  name: 'required' | 'minAndMax' | 'equalOtherValue' | 'email' | 'tel'
  args: ParamsConfig
}

export class TargetConfig {
  target: string
  message: MessageConfig
  validators: ValidateConfig[]
}

export class Config {
  validatorConfig: IValidatorConfig
  targetConfig: TargetConfig[]
}

export const $$ = (selector: string): HTMLInputElement & HTMLElement => document.querySelector(selector)

export class Validator {
  private validatorConfig: IValidatorConfig
  private targetConfig: TargetConfig[]
  private allTarget: string[] = []

  constructor (config: Config) {
    this.validatorConfig = config.validatorConfig
    this.targetConfig = config.targetConfig
    this.allTarget = this.targetConfig.map(config => config.target)
  }

  // 验证主逻辑
  _check (config: TargetConfig) {
    const validatorConfig = this.validatorConfig
    const $target: HTMLInputElement = $$(config.target)
    const val = $target.value
    const $message = $$(config.message.target)
    const ownValidator = config.validators
    const result: string[] = []
    let required = false

    ownValidator.forEach(validator => {
      required = validator.name === 'required'
      const temp = Validators[validator.name](val, validator.args)
      if (!temp.status) {
        result.push(temp.message)
      }

      if (!required && val.length === 0) return

      if (result.length > 0) {
        validatorConfig.error && validatorConfig.error($target)
        $message.textContent = result[0]
      } else {
        validatorConfig.success && validatorConfig.success($target)
        $message.textContent = config.message.success || ''
      }
    })
  }

  // 单个表单的验证，单个执行_check
  run (target: Element) {
    const currentConfig = this.targetConfig.filter(config => config.target === `#${target}`)[0]
    this._check(currentConfig)
  }

  // 执行所有_check
  runAll () {
    this.targetConfig.forEach(this._check.bind(this))
  }

  // 重置表单
  reset () {
    this.targetConfig.forEach(config => {
      const $target = $$(config.target)
      const $message = $$(config.message.target)

      $target.value = ''
      $message.textContent = config.message.placeholder || ''
    })
    this.validatorConfig.reset(this.allTarget)
  }
}