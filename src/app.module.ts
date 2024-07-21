import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    //To stablish the environment variables
    ConfigModule.forRoot(),

    //DataBase configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, //False in production
      extra: {
        connectionTimeoutMillis: 30000, // 30 segundos
      },
      logging: 'all',
    }),

    CommonModule,

    AuthModule,
  ],
})
export class AppModule {}
