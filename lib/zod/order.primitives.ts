import { z } from "zod";


export const orderPedido = z.string();
export const orderQuantidade = z.number().int().positive();
export const orderStatus = z.enum(["BACKLOG", "ANDAMENTO", "ENTREGA", "CONCLUIDO"]);
export const orderEntregador = z.string().toLowerCase().regex(/^[a-zA-Z]+$/, "apenas letras são permitidas");
export const orderRua = z.string().regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .-]+$/, "sintaxe inválida");
export const orderNumeroRua = z.string().regex(/^[A-Za-z0-9]+$/, "sintaxe inválida");
export const orderComplemento = z.string().regex(/^[\p{L}\p{N}\s.,!?~-]+$/u);

export const orderCep = z.string().refine(value => {
    value = value.replace(/\D/g, "");
    return /^[0-9]{8}$/.test(value)
}, "");

export const orderCidade = z.string().regex(/^[\p{L}]+$/u, "sintaxe inválida");
export const orderEstado = z.string().regex(/^[\p{L}]+$/u, "sintaxe inválida");

export const orderTel = z.string().refine((value) => {
    value = value.replace(/\D/g, "");
    return /^(1[1-9]|[2-9][0-9])9\d{8}$/.test(value)
}, "Invalid Number");

export const orderMetodoPag = z.string().regex(/^[\p{L}]+$/u, "método de pagamento inválido");
export const orderInstrucoes = z.string().max(80).regex(/^[\p{L}\p{N}\s.,!?~-]+$/u, "caracteres inválidos");

export const orderId = z.string({
        required_error: "Order Id is required",
        invalid_type_error: "Order Id must be a string"
}).uuid();
