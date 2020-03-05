/* eslint-env mocha */
'use strict'

const assert = require('assert')
const _isEmpty = require('lodash/isEmpty')
const stop = require('../../../../lib/host/events/stop')
const AsyncEventEmitter = require('../../../../lib/async_event_emitter')

describe('host:events:stop', () => {
  it('does nothing if the instance is already stopped', async () => {
    return stop({
      instances: {}
    }, 'a', () => {
      assert.ok(false, 'cleanup should not have been called')
    })
  })

  it('removes all non-order-cancel listeners', async () => {
    const ev = new AsyncEventEmitter()

    ev.on('test', () => assert.ok(false, 'should have been removed'))

    await stop({
      emit: async () => {},
      instances: {
        a: { state: { ev } }
      }
    }, 'a')

    ev.emit('test')
  })

  it('calls cleanup callback if provided', (done) => {
    const ev = new AsyncEventEmitter()

    stop({
      emit: async () => {},
      instances: {
        a: { state: { ev } }
      }
    }, 'a', done)
  })

  it('emits ao:stop event on host', (done) => {
    const ev = new AsyncEventEmitter()

    stop({
      emit: async (eventName) => {
        if (eventName === 'ao:stop') {
          done()
        }
      },
      instances: {
        a: { state: { ev } }
      }
    }, 'a')
  })

  it('gets rid of the instance', async () => {
    const ev = new AsyncEventEmitter()
    const instances = { a: { state: { ev } } }

    await stop({
      instances,
      emit: async (eventName) => {
        if (eventName === 'ao:stop') {
        }
      }
    }, 'a')

    assert.ok(_isEmpty(instances))
  })
})
