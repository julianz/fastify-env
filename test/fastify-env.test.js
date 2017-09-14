'use strict'

const t = require('tap')
const Fastify = require('fastify')
const fastifyEnv = require('../index')

function makeTest (t, schema, data, isOk, confExpected, errorMessage) {
  t.plan(isOk ? 2 : 1)

  const fastify = Fastify()
  fastify.register(fastifyEnv, {
    confKey: 'config',
    schema: schema,
    data: data
  }, function (err) {
    if (isOk) {
      t.notOk(err)
      t.strictSame(fastify.config, confExpected)
      t.end()
      return
    }

    t.strictSame(err.message, errorMessage)
  })
}

const tests = [
  {
    name: 'empty ok',
    schema: { type: 'object' },
    data: { },
    isOk: true,
    confExpected: {}
  },
  {
    name: 'simple object - ok',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'string'
        }
      }
    },
    data: {
      PORT: '44'
    },
    isOk: true,
    confExpected: {
      PORT: '44'
    }
  },
  {
    name: 'simple object - ok - coerce value',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: {
      PORT: '44'
    },
    isOk: true,
    confExpected: {
      PORT: 44
    }
  },
  {
    name: 'simple object - ok - remove additional properties',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: {
      PORT: '44',
      ANOTHER_PORT: '55'
    },
    isOk: true,
    confExpected: {
      PORT: 44
    }
  },
  {
    name: 'simple object - ok - use default',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer',
          default: 5555
        }
      }
    },
    data: { },
    isOk: true,
    confExpected: {
      PORT: 5555
    }
  },
  {
    name: 'simple object - ok - required + default',
    schema: {
      type: 'object',
      required: [ 'PORT' ],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        }
      }
    },
    data: { },
    isOk: true,
    confExpected: {
      PORT: 6666
    }
  },
  {
    name: 'simple object - KO',
    schema: {
      type: 'object',
      required: [ 'PORT' ],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: { },
    isOk: false,
    errorMessage: 'should have required property \'PORT\''
  }
]

tests.forEach(function (testConf) {
  t.test(testConf.name, t => {
    makeTest(t, testConf.schema, testConf.data, testConf.isOk, testConf.confExpected, testConf.errorMessage)
  })
})
