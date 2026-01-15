const Koa = require('koa')
const Router = require('@koa/router')
const app = new Koa()
const router = new Router()

const seeds = [
  {
    id: 'p1',
    title: 'Midjourney 赛博朋克城市',
    cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylael_lyq/ljhwZthlaukjlkulzlp/cyberpunk_city.jpg',
    unlock_count: 128,
    content: 'cyberpunk city, night, rain, neon lights, 8k --ar 16:9'
  },
  {
    id: 'p2',
    title: 'Stable Diffusion 古风人像',
    cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylael_lyq/ljhwZthlaukjlkulzlp/ancient_girl.jpg',
    unlock_count: 89,
    content: 'chinese hanfu, portrait, elegant, soft lighting'
  }
]

// 列表（首页兜底）
router.get('/api/prompts', ctx => { ctx.body = { items: seeds } })

// 详情
router.get('/api/prompt/:id', ctx => {
  const item = seeds.find(s => s.id === ctx.params.id)
  ctx.body = { item }
})

// 搜索
router.get('/api/search-prompts', ctx => {
  const q = String(ctx.query.q || '').toLowerCase()
  const items = seeds.filter(s =>
    (s.title || '').toLowerCase().includes(q) ||
    (s.content || '').toLowerCase().includes(q)
  )
  ctx.body = { items }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 8000)
