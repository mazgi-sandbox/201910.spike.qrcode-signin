import * as fs from 'fs'
import * as path from 'path'
import { ConfigType } from './ConfigType'
import getConfigFromGCS from './getConfigFromGCS'
import getConfigFromS3 from './getConfigFromS3'
import getConfigFromURI from './getConfigFromURI'

/**
 * Global configuration object.
 *
 * Initialized when only process startup.
 * The configurations are based on `default.json` and that override by other data sources you defined via environment variables.
 */
class Config {
  private static config: ConfigType = null
  private static async loadConfig(): Promise<ConfigType> {
    const isDevelopment = 'development' == process.env.NODE_ENV
    const privateKey = process.env.BFF_PRIVATE_KEY_PEM_STRING
    const publicKey = process.env.BFF_PUBLIC_KEY_PEM_STRING
    const masterSecret = process.env.BFF_MASTER_SECRET_STRING

    // load default config from the file.
    const raw = fs.readFileSync(path.resolve(__dirname, 'default.json'), 'utf8')
    let defaultConfig = JSON.parse(raw)

    if (isDevelopment) {
      // load development config from the file that mounted by docker-compose.
      const raw = fs.readFileSync(`${process.cwd()}/tmp/config.json`, 'utf8')
      const devConfig = JSON.parse(raw)
      defaultConfig = { ...defaultConfig, ...devConfig }
    }

    const configFromURI = await getConfigFromURI()
    const configFromS3 = await getConfigFromS3()
    const configFromGCS = await getConfigFromGCS()

    const configMerged = {
      isDevelopment,
      privateKey,
      publicKey,
      masterSecret,
      ...defaultConfig,
      ...configFromURI,
      ...configFromS3,
      ...configFromGCS
    }

    console.log(
      `💽 load configurations: version: ${configMerged.version}, baseVersion: ${configMerged.baseVersion}`
    )
    if (isDevelopment) {
      // for TypeORM CLI
      fs.writeFileSync('ormconfig.json', JSON.stringify(configMerged.db))
    }

    return Object.freeze(configMerged)
  }
  static async getConfig(): Promise<ConfigType> {
    if (!this.config) {
      this.config = await this.loadConfig()
    }
    return this.config
  }
}

export default Config
