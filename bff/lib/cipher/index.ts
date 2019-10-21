import Config from 'config'
import crypto from 'crypto'

const Algorithm = 'aes-256-cbc'
export const encryptByMasterSecret = async (text: string): Promise<string> => {
  const config = await Config.getConfig()
  const masterSecret = config.masterSecret
  console.log(`secret: `, masterSecret)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(Algorithm, Buffer.from(masterSecret), iv)
  const encryptedText = cipher.update(text)
  const encrypted = Buffer.concat([encryptedText, cipher.final()])

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decryptByMasterSecret = async (
  encrypted: string
): Promise<string> => {
  const config = await Config.getConfig()
  const [ivHex, encryptedTextHex] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedText = Buffer.from(encryptedTextHex, 'hex')
  const decipher = crypto.createDecipheriv(
    Algorithm,
    Buffer.from(config.masterSecret),
    iv
  )
  const decryptedText = decipher.update(encryptedText)
  const decrypted = Buffer.concat([decryptedText, decipher.final()])
  return decrypted.toString()
}
