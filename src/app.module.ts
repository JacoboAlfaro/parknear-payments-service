import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { PagosModule } from './pagos/pagos.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MercadopagoModule,
    PagosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
