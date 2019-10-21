import * as fs from 'fs'
import { Storage } from '@google-cloud/storage'

async function getConfigFromGCS(): Promise<{}> {
  const bucket = process.env.BFF_CONFIG_SOURCE_GOOGLE_CLOUD_STORAGE_BUCKET
  const filename = process.env.BFF_CONFIG_SOURCE_GOOGLE_CLOUD_STORAGE_FILENAME
  const credentials = JSON.parse(
    process.env.BFF_CREADENTIALS_CONFIG_GOOGLE_CLOUD_STORAGE
  )
  if (!bucket || !filename || !credentials) {
    return null
  }
  console.log(`get config from gs://${bucket}/${filename}`)

  const storage = new Storage({ credentials })
  const destination = `${process.cwd()}/tmp/config.gcs.json`
  await storage
    .bucket(bucket)
    .file(`/${filename}`)
    .download({ destination })

  const rawConfig = fs.readFileSync(destination, 'utf8')
  const config = JSON.parse(rawConfig)
  return config
}

export default getConfigFromGCS
