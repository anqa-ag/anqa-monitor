import Redis from 'ioredis'

const key = {
  ignore_tokens: 'anqa_monitor:ignore_tokens',
}

console.log(`process.env.REDIS_HOST`, process.env.REDIS_HOST)
const redis = new Redis({
  port: Number(process.env.REDIS_PORT || 6379),
  host: process.env.REDIS_HOST || '127.0.0.1',
  password: process.env.REDIS_PASSWORD || undefined,
})

export async function getIgnoreTokens() {
  const ignoreTokens = await redis.smembers(key.ignore_tokens)
  return ignoreTokens
}

export async function addIgnoreToken(id: string) {
  await redis.sadd(key.ignore_tokens, id)
}

export async function removeIgnoreToken(id: string) {
  await redis.srem(key.ignore_tokens, id)
}
