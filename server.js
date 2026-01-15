const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

// 简单示例数据（先跑通流程；后续你可以改为读数据库）
const seeds = [
  {
    id: 'p1',
    title: 'Midjourney 赛博朋克城市',
    cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylael_lyq/ljhwZthlaukjlkulzlp/cyberpunk_city.jpg',
    unlock_count: 128,
    content: 'cyberpunk city, night, rain, neon lights, 8k --ar 16:9',
    category: '生图',
    models: ['Midjourney']
  },
  {
    id: 'p2',
    title: 'Stable Diffusion 古风人像',
    cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ylael_lyq/ljhwZthlaukjlkulzlp/ancient_girl.jpg',
    unlock_count: 89,
    content: 'chinese hanfu, portrait, elegant, soft lighting',
    category: '生图',
    models: ['Stable Diffusion']
  }
]

// 健康检查
router.get('/api/ping', ctx => { ctx.body = { ok: true, time: Date.now() } })

// 列表（首页兜底）
router.get('/api/prompts', ctx => {
  ctx.body = { items: seeds }
})

// 详情
router.get('/api/prompt/:id', ctx => {
  const item = seeds.find(s => s.id === ctx.params.id)
  ctx.body = { item: item || null }
})

// 搜索（前端已接入 /api/search-prompts?q=关键词）
router.get('/api/search-prompts', ctx => {
  const q = String(ctx.query.q || '').toLowerCase()
  const items = seeds.filter(s =>
    (s.title || '').toLowerCase().includes(q) ||
    (s.content || '').toLowerCase().includes(q) ||
    (s.category || '').toLowerCase().includes(q) ||
    JSON.stringify(s.models || []).toLowerCase().includes(q)
  )
  ctx.body = { items }
})

// 必须监听 8000 端口（模板部署要求）
const port = Number(process.env.PORT) || 8000
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.log('server listening on', port)
  })
