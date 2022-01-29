import { Hono } from '../../hono'
import { Middleware } from '../../middleware'

// Mock
const store: { [key: string]: string } = {
  'index.abcdef.mustache': '{{> header}}Title: {{ title }}{{> footer}}',
  'header.abcdef.mustache': '<html><body>',
  'footer.abcdef.mustache': '</body></html>',
}
const manifest = JSON.stringify({
  'index.mustache': 'index.abcdef.mustache',
  'header.mustache': 'header.abcdef.mustache',
  'footer.mustache': 'footer.abcdef.mustache',
})

Object.assign(global, { __STATIC_CONTENT_MANIFEST: manifest })
Object.assign(global, {
  __STATIC_CONTENT: {
    get: (path: string) => {
      return store[path]
    },
  },
})

describe.skip('Mustache by Middleware', () => {
  const app = new Hono()

  //  app.use('*', Middleware.mustache())
  app.get('/', (c) => {
    return c.render(
      'index',
      { title: 'Hono!' },
      {
        header: 'header',
        footer: 'footer',
      }
    )
  })

  it('Mustache template redering', async () => {
    const req = new Request('http://localhost/')
    const res = await app.dispatch(req)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('<html><body>Title: Hono!</body></html>')
  })
})
