import { FastifyReply } from 'fastify'
import { Trie } from '../models/trie'
import { FastifyServer, RequestGeneric } from '../types/serverHelper'

const VERSION = 'v1'
const CHECK_IP_ROUTE = 'check/:ip'

export interface CheckIpRequest {
  readonly Params: {
    readonly ip: string
  }
}

export function addIpCheckRoute(server: FastifyServer, trie: Trie): void {
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
      response: {
        200: {
          title: 'IP Address check response',
          type: 'object',
          properties: {
            valid: {
              type: 'boolean',
              description: 'weather the value is correct or not',
            },
            source: {
              type: 'string',
              description: 'file name that has the matching ip cidr or address',
            },
          },
          additionalProperties: false,
          required: ['valid'],
        },
      },
    },
  }

  function checkIpHandler(
    req: RequestGeneric<CheckIpRequest>,
    reply: FastifyReply,
  ): void {
    const { ip } = req.params
    const check = trie.search(ip)

    const response = check
      ? {
          valid: false,
          source: check,
        }
      : {
          valid: true,
        }

    reply.send(response)
  }

  server.get(
    `/${VERSION}/${CHECK_IP_ROUTE}`,
    checkIpRouteOptions,
    checkIpHandler,
  )
}
