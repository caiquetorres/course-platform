import { DataSource } from 'typeorm'

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()

const entitiesPath = path.resolve(__dirname, 'src/**/*.entity.ts')
const migrationsPath = path.resolve(__dirname, 'src/migrations/*.ts')

const dataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  synchronize: false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
})

export default dataSource
