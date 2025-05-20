import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'my-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
