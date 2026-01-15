const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()
app.use(bodyParser())

// 示例数据（先跑通流程；后续你可接数据库）
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

const creators = [
  { id:'u1', nickname:'野豹儿', avatar:'', custom_id:'yebao', prompt_count:12, favorite_total:300, unlock_total:100 },
  { id:'u2', nickname:'AI绘者', avatar:'', custom_id:'aiartist', prompt_count:8, favorite_total:180, unlock_total:70 }
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

// 搜索提示词
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

// 搜索创作者
router.get('/api/search-creators', ctx => {
  const q = String(ctx.query.q || '').toLowerCase()
  const items = creators.filter(u =>
    (u.nickname || '').toLowerCase().includes(q) ||
    (u.custom_id || '').toLowerCase().includes(q)
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
