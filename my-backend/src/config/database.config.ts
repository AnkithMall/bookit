import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

export const getDbConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const entities = [__dirname + '/../**/*.entity{.ts,.js}'] as (string | Function)[];
  const commonConfig = {
    entities,
    synchronize: process.env.NODE_ENV !== 'production', // safer default
    logging: process.env.TYPEORM_LOGGING === 'true', // default off; set env to enable
  };

  const dbUrl = configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
      await client.connect();
      await client.end();
      return {
        type: 'postgres',
        url: dbUrl,
        ...commonConfig,
      } satisfies TypeOrmModuleOptions;
    } catch (e) {
      // Fallback to SQLite when Postgres is unreachable
      // console.warn('Postgres unreachable, falling back to SQLite:', (e as Error).message);
      return {
        type: 'sqlite',
        database: 'sql_app.db',
        ...commonConfig,
      } satisfies TypeOrmModuleOptions;
    }
  }

  return {
    type: 'sqlite',
    database: 'sql_app.db',
    ...commonConfig,
  } satisfies TypeOrmModuleOptions;
};
