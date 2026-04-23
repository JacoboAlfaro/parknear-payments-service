#!/bin/bash

# Configuration
TEST_PUBLIC_KEY="TEST-a1b2c3d4-e5f6-7890-abcd-1234567890ab" # Replace with your TEST public key
BACKEND_URL="http://localhost:3000"

echo "--- Iniciando prueba de flujo de pago ---"

# 1. Obtener Token de Tarjeta
echo "1. Generando token de tarjeta..."
TOKEN_RESPONSE=$(curl -s -X POST "https://api.mercadopago.com/v1/card_tokens?public_key=${TEST_PUBLIC_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "card_number": "4509953566233704",
    "security_code": "123",
    "expiration_month": 12,
    "expiration_year": 2030,
    "cardholder": {
      "name": "APRO",
      "identification": {
        "type": "CPF",
        "number": "12345678909"
      }
    }
  }')

CARD_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.id')

if [ "$CARD_TOKEN" == "null" ] || [ -z "$CARD_TOKEN" ]; then
    echo "Error: No se pudo generar el token. Respuesta: $TOKEN_RESPONSE"
    exit 1
fi

echo "   Token generado: $CARD_TOKEN"

# 2. Crear Pago en el Backend
echo "2. Creando pago en backend..."
PAYO_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/pagos" \
  -H "Content-Type: application/json" \
  -d "{
    \"idReserva\": 9,
    \"monto\": 6514.00,
    \"datosPago\": {
      \"transaction_amount\": 6514.00,
      \"token\": \"$CARD_TOKEN\",
      \"installments\": 1,
      \"payment_method_id\": \"visa\",
      \"payer\": {
        \"email\": \"test_user_123@testuser.com\"
      }
    }
  }")

echo "   Resultado del pago:"
echo "$PAYO_RESPONSE" | jq .
