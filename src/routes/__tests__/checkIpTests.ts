import fastify from 'fastify'
import { createTrie } from '../../models/trie'
import { addIpCheckRoute } from '../checkIp'

describe('Check IP address endpoint', () => {
  const trie = createTrie()
  trie.insert('0.0.0.0/8', 'test')

  const server = fastify()
  addIpCheckRoute(server, trie)

  it('handles the correct IP as valid', async () => {
    const validIp = '1.1.1.1'

    const res = await server.inject({
      method: 'GET',
      url: `/v1/check/${validIp}`,
    })

    expect(res.statusCode).toEqual(200)
    expect(res.json()).toEqual({
      valid: true,
    })
  })

  it('handles the incorrect IP as not valid', async () => {
    const validIp = '0.0.0.1'

    const res = await server.inject({
      method: 'GET',
      url: `/v1/check/${validIp}`,
    })

    expect(res.statusCode).toEqual(200)
    expect(res.json()).toEqual({
      valid: false,
      source: 'test',
    })
  })
})
