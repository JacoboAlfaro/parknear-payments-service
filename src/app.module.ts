import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MercadopagoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
