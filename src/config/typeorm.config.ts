import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'i4mth3d3v#db',
  database: 'nestours',
  entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
  synchronize: true,
};
