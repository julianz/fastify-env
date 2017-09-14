# fastify-env
[![Build Status](https://travis-ci.org/fastify/fastify-env.svg?branch=master)](https://travis-ci.org/fastify/fastify-env)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Fastify plugin to check environment variables

## Install

```
npm install --save fastify-env
```

## Usage

```js
const fastify = require('fastify')()
const fastifyEnv = require('fastify-env')

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const options = {
  confKey: 'config', // optional
  schema: schema,
  data: data // optional, default: process.env
}
fastify.register(fastifyEnv, options, function (err) {
   // or fastify[options.confKey]
  console.log(fastify.config)
  // output: { PORT: 3000 }
})
```

**NB:** internally this plugin force to not have additional properties, so the `additionalProperties` flag is forced to be `false`


## Acknowledgements

Kindly sponsirized by [Mia Platform](https://www.mia-platform.eu/)
