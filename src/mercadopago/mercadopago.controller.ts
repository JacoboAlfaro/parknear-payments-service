import { Body, Controller, Post } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('notificacion')
  async notificacion(@Body() cuerpo: string) {
    console.log('Notificación recibida:', cuerpo);
    //return this.mercadopagoService.notificacion(body);
  }
}
