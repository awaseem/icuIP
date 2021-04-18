import fastify, {
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyRequest,
} from 'fastify'
import middie from 'middie'
import fastifySwagger from 'fastify-swagger'
import { Server, IncomingMessage, ServerResponse } from 'http'

export type FastifyServer = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
>

export type RequestGeneric<T> = FastifyRequest<T, Server, IncomingMessage>

export function createServer(): FastifyServer {
  return fastify()
}

export async function registerPlugins(server: FastifyServer): Promise<void> {
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
