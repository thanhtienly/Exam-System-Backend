import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from './db/typeorm.module';
import { CourseModule } from './courses/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule,
    UserModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
