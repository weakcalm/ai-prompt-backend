const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()
app.use(bodyParser())

const seeds = [
  { id: 'p1', title: 'Midjourney 赛博朋克城市', cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylael_lyq/ljhwZthlaukjlkulzlp/cyberpunk_city.jpg', unlock_count: 128, content: '...' },
  { id: 'p2', title: 'Stable Diffusion 古风人像', cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylael_lyq/ljhwZthlaukjlkulzlp/ancient_girl.jpg', unlock_count: 89, content: '...' }
]

router.get('/api/prompts', ctx => { ctx.body = { items: seeds } })
router.get('/api/prompt/:id', ctx => { ctx.body = { item: seeds.find(s => s.id === ctx.params.id) || null } })
router.get('/api/search-prompts', ctx => {
  const q = String(ctx.query.q || '').toLowerCase()
  const items = seeds.filter(s =>
    (s.title || '').toLowerCase().includes(q) ||
    (s.content || '').toLowerCase().includes(q)
  )
  ctx.body = { items }
})

const port = Number(process.env.PORT) || 8000
app.use(router.routes()).use(router.allowedMethods()).listen(port, () => {
  console.log('server listening on', port)
})
