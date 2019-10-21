import { ConnectionOptions } from 'typeorm'

export type ConfigType = {
  version: string
  baseVersion: string
  isDevelopment: boolean
  privateKey: string
  publicKey: string
  masterSecret: string
  db: ConnectionOptions
  email: {
    type: string
    address: string
    password?: string
  }
  server: {
    port: number
    origins: string[]
  }
  seeds: {
    users: {}
  }
}
