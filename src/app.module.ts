import { Module } from '@nestjs/common';

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';

import { UserModule } from '@app/user/user.module';

import { TypeOrmModule } from '@nestjs/typeorm';

import config from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config), TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
