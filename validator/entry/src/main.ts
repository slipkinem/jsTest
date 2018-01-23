/**
 * Created by slipkinem on 1/23/2018 at 2:55 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import './index.css'
import { $$, IValidatorConfig, Validator } from './lib/validator'
import { TargetConfig } from './lib/validator'

class validatorConfig implements IValidatorConfig {
  error: ($target: HTMLInputElement) => void = ($target => {
    let cls = $target.parentElement.parentElement.parentElement.classList
    cls.remove('success')
    cls.add('error')
  })

  success: ($target: HTMLInputElement) => void = ($target => {
    let cls = $target.parentElement.parentElement.parentElement.classList
    cls.remove('error')
    cls.add('success')
  })

  reset: (allTarget: string[]) => void = (allTarget => {
    allTarget.forEach(selector => {
      $$(selector).parentElement.parentElement.parentElement.classList.remove('error', 'success')
    })
  })
}

const targetConfig: TargetConfig[] = [
  {
    target: '#username',
    message: {
      target: '#username-message',
      success: '这是成功的'
    },
    validators: [
      {
        name: 'required',
        args: {
          message: '这是必须的'
        }
      }
    ]
  }
]

window.onload = function () {
  const $submit = $$('#submit'),
      $reset = $$('#reset'),
      $inputs = document.querySelectorAll('.ls-form-item input'),
      validator = new Validator({ validatorConfig: new validatorConfig(), targetConfig })

  ;[].forEach.call($inputs, $input => {
    $input.addEventListener('blur', e => validator.run(e.target.id))
  })

  $submit.addEventListener('click', () => validator.runAll())

  $reset.addEventListener('click', () => validator.reset())
}