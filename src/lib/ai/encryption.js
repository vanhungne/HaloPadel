import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

function getSecretKey() {
  const secret = process.env.AI_KEY_ENCRYPTION_SECRET
  if (!secret) {
    throw new Error('Thiếu cấu hình AI_KEY_ENCRYPTION_SECRET trong .env')
  }
  // Đảm bảo secret có đúng 32 bytes (256 bits)
  if (secret.length !== 32) {
    return crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32)
  }
  return secret
}

export function encryptApiKey(apiKey) {
  if (!apiKey) return ''
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getSecretKey()), iv)
  let encrypted = cipher.update(apiKey)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decryptApiKey(encryptedKey) {
  if (!encryptedKey) return ''
  const textParts = encryptedKey.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(getSecretKey()), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export function maskApiKey(apiKey) {
  if (!apiKey || apiKey.length < 8) return '****'
  // mask like gsk_a1b2c...xyz
  const prefix = apiKey.substring(0, 8)
  const suffix = apiKey.substring(apiKey.length - 4)
  return `${prefix}...${suffix}`
}
