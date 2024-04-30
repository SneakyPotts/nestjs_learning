import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default config;

/*
GRANT ALL PRIVILEGES ON DATABASE mediumclone TO mediumclone;
GRANT ALL PRIVILEGES ON SCHEMA public TO mediumclone;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mediumclone;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mediumclone;
*/
