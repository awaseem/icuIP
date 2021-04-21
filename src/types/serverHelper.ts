import { FastifyInstance, FastifyLoggerInstance, FastifyRequest } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'node:http'

export type FastifyServer = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
>

export type RequestGeneric<T> = FastifyRequest<T, Server, IncomingMessage>
