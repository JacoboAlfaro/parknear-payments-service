import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { MercadopagoService } from '../mercadopago/mercadopago.service';
import type { CrearPagoDto } from './dtos/crear-pago.dto';
import type { CrearPagoResultado } from './dtos/pago-resultado.interface';

@Controller('pagos')
export class PagosController {
	constructor(
		private readonly pagosService: PagosService,
		private readonly mercadopagoService: MercadopagoService,
	) {}

	@Post()
	async crearPago(@Body() body: CrearPagoDto): Promise<CrearPagoResultado> {
		if (!body?.idReserva || !body?.datosPago?.token || !body?.datosPago?.payer?.email) {
			throw new BadRequestException('Faltan campos obligatorios para crear el pago');
		}

		const monto = body.monto ?? body.datosPago.transaction_amount;
		if (monto === undefined || monto === null) {
			throw new BadRequestException('Debes enviar el monto del pago');
		}

		const pagoPendiente = await this.pagosService.crearPagoPendiente(body.idReserva, String(monto));

		const respuestaMp = await this.mercadopagoService.procesarPago({
			...body.datosPago,
			transaction_amount: Number(monto),
		});

		const pagoActualizado = await this.pagosService.actualizarPagoDesdeProcesamiento(
			pagoPendiente.id,
			respuestaMp,
		);

		return {
			pago: pagoActualizado,
			mercadopago: {
				id: respuestaMp.id,
				status: respuestaMp.status,
				status_detail: respuestaMp.status_detail,
			},
		};
	}

	@Get(':idPago')
	async obtenerPago(@Param('idPago', ParseIntPipe) idPago: number) {
		const pago = await this.pagosService.obtenerPagoPorId(idPago);
		if (!pago) {
			throw new NotFoundException('Pago no encontrado');
		}

		return pago;
	}

	@Get('usuario/:idUsuario')
	async obtenerPagosPorUsuario(@Param('idUsuario') idUsuario: string) {
		return this.pagosService.obtenerPagosPorUsuario(idUsuario);
	}
}
