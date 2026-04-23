import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('notificacion')
  async notificacion(
    @Body() cuerpo: { data?: { id?: string | number } },
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const esValida = this.mercadopagoService.validarNotificacion(headers, cuerpo);
    if (!esValida) {
      throw new UnauthorizedException('Firma de webhook de Mercado Pago invalida');
    }

    console.log('Notificación recibida:', cuerpo);
    console.log('Headers recibidos:', headers);
    //return this.mercadopagoService.notificacion(body);
  }
}
