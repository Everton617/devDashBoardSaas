import { z } from 'zod'

export const FormDataSchema = z.object({
  pedido: z.string().nonempty('Name is required.'),
  produtos: z
    .string()
    .nonempty('Message is required.')
    .min(2, { message: 'Message must be at least 6 characters.' }),
  quantidade: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: "A quantidade deve ser um número",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1, {
      message: "É necessário que a quantidade seja maior que 0 ",
    }),
    rua: z.string().nonempty('A rua do destinatário é obrigatória.'),
    numero: z.string()
  .refine((val) => !isNaN(Number(val)), {
    message: "Digite um número",
  })
  .transform((val) => Number(val))
  .refine((val) => val >= 1, {
    message: "O número deve ser pelo menos 1",
  }),
  complemento: z.string().nonempty('O complemento é obrigatório.'),
  cep: z.string().nonempty('O CEP é obrigatório.'),
  cidade: z.string().nonempty('A cidade é obrigatória.'),
  telefone: z.string().nonempty('O telefone é obrigatório.'),
  estado: z.string().nonempty('O estado é obrigatório.'),
  entregador: z.string().nonempty('O nome do entregador é obrigatório.'),
  pagamento: z.string().nonempty('A forma de pagamento é obrigatória.'),
})