import { FastifyRequest, FastifyReply } from 'fastify'
import { FastifyServer } from '../types/serverHelper'

const VERSION = 'v1'
const STATUS_ROUTE = 'status'

export function addStatusRoute(server: FastifyServer): void {
  const statusRouteOptions = {
    schema: {
      description: 'Get a OK response from the server',
      summary: 'Status response',
      tags: ['status'],
      params: {},
    },
  }

  function statusHandler(_req: FastifyRequest, reply: FastifyReply): void {
    reply.send('OK')
  }

  server.get(`/${VERSION}/${STATUS_ROUTE}`, statusRouteOptions, statusHandler)
}
