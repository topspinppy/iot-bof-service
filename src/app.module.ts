import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigSchema } from './config.schema';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigSchema>) => {
        const mongoURI = configService.get<string>('MONGODB_URI');
        return {
          uri: mongoURI,
          connectionFactory: (connection) => {
            return connection;
          },
        };
      },
    }),
    AuthenticationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
