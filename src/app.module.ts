import { Module } from '@nestjs/common';
import { MercadopagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [MercadopagoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
