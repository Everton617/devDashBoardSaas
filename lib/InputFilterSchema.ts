import { z } from 'zod'

export const InputFilterSchema = z.object({
    id: z.string(),
    Pedido: z.string().min(1).nonempty(),
    Produtos: z.array(z.string()).min(5, { message: "Must be 5 or more characters long" }).nonempty(),
    Quantidade: z.number().gte(1).positive(),
    Entregador: z.string().min(5, { message: "Must be 5 or more characters long" }).nonempty(),
    Rua: z.string().min(5, { message: "Must be 5 or more characters long" }).max(15).nonempty(),
    Numero: z.number().gte(1).positive(),
    Complemento: z.string().min(1).nonempty(),
    Cep: z.string().min(8, { message: "Must be 8 or more characters long" }).nonempty(),
    Cidade: z.string().min(5, { message: "Must be 5 or more characters long" }).nonempty(),
    Estado: z.string().min(5, { message: "Must be 5 or more characters long" }).nonempty(),
    Telefone: z.string().min(9, { message: "Must be 5 or more characters long" }).nonempty(),
    Pagamento: z.string().nonempty(),
    Instructions: z.string().min(1),
  })