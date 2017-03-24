/**
 * Created by slipkinem on 2017/3/24.
 */
'use strict'

function Promise(resolver) {
  
  function resolve(value) {
    this.defrreds = []
  }
  
  resolver(resolve)
  
}