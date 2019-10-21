import { decryptByMasterSecret, encryptByMasterSecret } from '.'

test('encrypt and decript', async () => {
  const text = 'test string'
  const encrypted = await encryptByMasterSecret(text)
  const decripted = await decryptByMasterSecret(encrypted)
  expect(text === decripted).toBe(true)
})
