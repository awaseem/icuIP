import fastify from 'fastify'
import middie from 'middie'
import fastifySwagger from 'fastify-swagger'
import { Trie } from '../models/trie'
import { addIpCheckRoute } from '../routes/checkIp'
import { addStatusRoute } from '../routes/status'
import { FastifyServer } from '../types/serverHelper'

const DEFAULT_PORT = 8080
const DEFAULT_ADDRESS = '0.0.0.0'

export interface IcuIPServer {
  readonly start: () => Promise<void>
}

export function createServer(trie: Trie): IcuIPServer {
  function registerHandlers(server: FastifyServer): void {
    // Add routes
    addStatusRoute(server)
    addIpCheckRoute(server, trie)
  }

  function getPort(): number {
    return process.env.ICUIP_PORT
      ? Number(process.env.ICUIP_PORT)
      : DEFAULT_PORT
  }

  function getAddress(): string {
    return process.env.ICUIP_ADDRESS ?? DEFAULT_ADDRESS
  }

  async function registerPlugins(server: FastifyServer): Promise<void> {
    // Middie is the plugin that add middlewares support on steroids to Fastify.
    await server.register(middie)

    // Swagger automatically generate documents based on the json schemas for routes
    await server.register(fastifySwagger, {
      swagger: {
        info: {
          title: 'icupIP 👀',
          description: 'Simple API to check IP addresses',
          version: '0.1.0',
        },
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
      exposeRoute: true,
      routePrefix: '/docs',
    })
  }

  async function start(): Promise<void> {
    // Build server
    const server = fastify()

    // Apply middleware
    await registerPlugins(server)

    // Add routes
    registerHandlers(server)

    // Start the server
    const port = getPort()
    const address = getAddress()

    const url = await server.listen(port, address)
    console.log(`Server listening at ${url}`)
  }

  return Object.freeze({
    start,
  })
}
