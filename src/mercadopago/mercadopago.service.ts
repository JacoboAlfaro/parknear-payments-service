import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';

type HeadersMap = Record<string, string | string[] | undefined>;
type NotificationBody = {
	data?: {
		id?: string | number;
	};
};
let mp_secret: string | undefined;
@Injectable()
export class MercadopagoService {
	constructor(private readonly configService: ConfigService) {
        mp_secret = this.configService.get<string>('MERCADOPAGO_WEBHOOK_SECRET');
    }

	validarNotificacion(headers: HeadersMap, cuerpo: NotificationBody): boolean {
		if (!mp_secret) {
			return false;
		}

		const signatureHeader = this.headerValue(headers, 'x-signature');
		const requestId = this.headerValue(headers, 'x-request-id');
		const dataId = cuerpo.data?.id;

		if (!signatureHeader || !requestId || dataId === undefined) {
			return false;
		}

		const { ts, v1 } = this.parseSignatureHeader(signatureHeader);
		if (!ts || !v1) {
			return false;
		}

		const manifest = `id:${String(dataId)};request-id:${requestId};ts:${ts};`;
		const expected = createHmac('sha256', mp_secret).update(manifest).digest('hex');

		return this.safeCompare(expected, v1);
	}

	private parseSignatureHeader(signatureHeader: string): { ts?: string; v1?: string } {
		const parts = signatureHeader.split(',');
		let ts: string | undefined;
		let v1: string | undefined;

		for (const part of parts) {
			const [rawKey, rawValue] = part.split('=');
			if (!rawKey || !rawValue) {
				continue;
			}

			const key = rawKey.trim();
			const value = rawValue.trim();

			if (key === 'ts') {
				ts = value;
			}

			if (key === 'v1') {
				v1 = value;
			}
		}

		return { ts, v1 };
	}

	private headerValue(headers: HeadersMap, key: string): string | undefined {
		const value = headers[key] ?? headers[key.toLowerCase()];
		if (Array.isArray(value)) {
			return value[0];
		}

		return value;
	}

	private safeCompare(expected: string, received: string): boolean {
		const expectedBuffer = Buffer.from(expected, 'hex');
		const receivedBuffer = Buffer.from(received, 'hex');

		if (expectedBuffer.length !== receivedBuffer.length) {
			return false;
		}

		return timingSafeEqual(expectedBuffer, receivedBuffer);
	}
}
