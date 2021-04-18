import { FastifyRequest, FastifyReply } from 'fastify'
import { FastifyServer } from '../server/server'

const VERSION = 'v1'
const CHECK_IP_ROUTE = 'check/:ip'

export function addIpCheckRoute(server: FastifyServer): void {
  const checkIpRouteOptions = {
    schema: {
      description: 'Check if IP is valid or not',
      summary: 'Check IP',
      tags: ['check'],
      params: {
        title: 'IP address parameter',
        type: 'object',
        properties: {
          ip: {
            type: 'string',
            format: 'ipv4',
            description: 'IPv4 address to check weather its valid or not',
          },
        },
        additionalProperties: false,
        required: ['ip'],
      },
    },
  }

  function checkIpHandler(req: FastifyRequest, reply: FastifyReply): void {
    console.log(req.params)

    reply.send('OK')
  }

  server.get(
    `/${VERSION}/${CHECK_IP_ROUTE}`,
    checkIpRouteOptions,
    checkIpHandler,
  )
}
