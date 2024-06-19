import { z } from "zod";


export const orderPedido = z.string();
export const orderQuantidade = z.number().int().positive();
export const orderStatus = z.enum(["BACKLOG", "ANDAMENTO", "ENTREGA", "CONCLUIDO"]);
export const orderEntregador = z.string().toLowerCase().regex(/^[a-zA-Z]+$/, "Only leters are allowed");
export const orderRua = z.string();
export const orderNumeroRua = z.string().regex(/^\d+[a-zA-Z-]?$|^\d+-\d+$/, "Invalid 'Rua' characters");
export const orderComplemento = z.string().regex(/^[\p{L}\p{N}\s.,!?~-]+$/u);

export const orderCep = z.string().refine(value => {
    value = value.replace(/\D/g, "");
    return /^[0-9]{8}$/.test(value)
}, "Invalid CEP syntax");

export const orderCidade = z.string();
export const orderEstado = z.string();

export const orderTel = z.string().refine((value) => {
    value = value.replace(/\D/g, "");
    return /^(1[1-9]|[2-9][0-9])9\d{8}$/.test(value)
}, "Invalid Number");

export const orderMetodoPag = z.string();
export const orderInstrucoes = z.string().max(80).regex(/^[\p{L}\p{N}\s.,!?~-]+$/u, "Characters not allowed");

export const orderId = z.string({
        required_error: "Order Id is required",
        invalid_type_error: "Order Id must be a string"
    }).uuid();

