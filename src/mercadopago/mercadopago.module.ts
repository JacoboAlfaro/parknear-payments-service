import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';

@Module({
  providers: [MercadopagoService],
  controllers: [MercadopagoController]
})
export class MercadopagoModule {}
