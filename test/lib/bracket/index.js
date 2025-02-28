/* eslint-env mocha */
'use strict'

process.env.DEBUG = '*'

const Bracket = require('../../../lib/bracket')
const testAOLive = require('../../util/test_ao_live')

testAOLive({
  name: 'Bracket',
  aoID: 'bfx-bracket',
  aoClass: Bracket,
  defaultParams: {
    _symbol: 'tLEOUSD',
    _futures: false,
    _margin: true,

    orderType: 'LIMIT',
    orderPrice: 2,
    action: 'Sell',
    amount: 6,

    limitPrice: 0.8,
    stopPrice: 2.1,
    ocoAmount: 6,
    ocoAction: 'Buy'
  },

  tests: [{
    description: 'submits initial order on startup',
    execEarly: ({ harness, done }) => {
      harness.once('self:submit_initial_order', done)
    }
  }, {
    description: 'submits OCO order when the initial order fills',
    execEarly: ({ instance, harness, done }) => {
      harness.once('self:submit_initial_order', () => {
        harness.once('self:submit_oco_order', done)
        harness.trigger('orders', 'order_fill', { amount: 0 })
      })
    }
  }]
})
