# Order
  <details>
  <summary><h2>GET</h2></summary>
    
  ## Exemplo de Requisição: 
  
  ```javascript
  const router = useRouter();
  const { slug } = router.query;  // pegando o slug do 'team'
  
  // enviando o pedido para o bakckend
  const response = await fetch(`/api/teams/${slug}/order`, {
       method: "GET",
       headers: {"content-type": "application/json"},
  });
  ```
  ## Retorno da requisição, quando bem sucedida:
  ```bash
    [
      {
        id: 'a012035f-a6d5-4519-a2f0-13777ed0d084',
        pedido: '3x pastel de uva',
        quantidade: 2,
        status: 'ANDAMENTO',
        entregador: 'marcelo',
        rua: 'Alameda',
        numero: '12',
        complemento: 'perto dali',
        cep: '59158-210',
        cidade: 'Natal',
        estado: 'RN',
        tel: '(84) 98752-2972',
        metodo_pag: 'cartão',
        instrucoes: 'sem tijoloa',
        createdBy: 'axa'
      },
      {
        id: '4b751b06-bc6c-498d-aa92-2c7f1678a595',
        pedido: '3x pastel de uva',
        quantidade: 2,
        status: 'ANDAMENTO',
        entregador: 'marcelo',
        rua: 'Alameda',
        numero: '12',
        complemento: 'perto dali',
        cep: '59158-210',
        cidade: 'Natal',
        estado: 'RN',
        tel: '(84) 98752-2972',
        metodo_pag: 'cartão',
        instrucoes: 'sem tijoloa',
        createdBy: 'axa'
      }
    ]
  ```
    
  </details>
  
  <details>
  <summary><h2>POST</h2></summary>

  ## Exemplo de Requisição: 
  
  ```javascript
  const router = useRouter();
  const { slug } = router.query;  // pegando o slug do 'team'

  // exemplo de pedido válido
  const order = {
      pedido: "3x pastel de uva",
      quantidade: 2,
      status: "ANDAMENTO",      // (opcional) valores: BACKLOG | ANDAMENTO | ENTREGA | CONCLUIDO - valor default é BACKLOG
      entregador: "Marcelo",
      numero: "12",
      complemento: "perto dali",
      cep: "59158-210",
      tel: "(84) 98752-2972",
      metodo_pag: "cartão",
      instrucoes: "sem tijoloa"
  }
  
  // enviando o pedido para o bakckend
  const response = await fetch(`/api/teams/${slug}/order`, {
       method: "POST",
       headers: {"content-type": "application/json"},
       body: JSON.stringify({order})
  });
  ```

> [!NOTE]
> 
> Para criação de pedidos, não é necessário passar o campo `id`, pois o banco gera um uuid() automaticamente.
> 
> Para o endereço, apenas o `cep` será necessário. O resto será preenchido automaticamente pelo backend.
 
  ## Retorno da requesição, quando bem sucedida:
  
  ```bash
  {
    data: {
      id: 'eb1ff15c-bcad-4180-af76-783cc730594c',    # id do pedido, retornado pelo banco
      pedido: '3x pastel de uva',
      quantidade: 2,
      status: 'ANDAMENTO',
      horario: 2024-06-20T18:40:23.515Z,            # data/horário de criação do pedido, retornado pelo banco
      entregador: 'marcelo',
      rua: 'Alameda',
      numero: '12',
      complemento: 'perto dali',
      cep: '59158-210',
      cidade: 'Natal',
      estado: 'RN',
      tel: '(84) 98752-2972',
      metodo_pag: 'cartão',
      instrucoes: 'sem tijoloa',
      createdBy: 'cab',                            # nome do usuário que salvou o pedido
    }
  }
  ```
  Regex utilizado para validações dos campos:
  ```typescript
  // pasta: lib/zod/order.primitives

  export const orderPedido = z.string();
  export const orderQuantidade = z.number().int().positive();
  export const orderStatus = z.nativeEnum(OrderStatus).optional();
  export const orderEntregador = z.string().regex(/^[\p{L}\s']+$/u, "apenas letras são permitidas");
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
  ```
  </details>

  <details>
    <summary><h2>PUT</summary>
    Ainda em desenvolvimento, falar com hierro.
  </details>

  <details>
  <summary><h2>DELETE</summary>

  ## Exemplo de Requisição: 
  
  ```javascript
  const router = useRouter();
  const { slug } = router.query;  // pegando o slug do 'team'

  const orderId = "4b751b06-bc6c-498d-aa92-2c7f1678a595"
  // se o id no front estiver como "item-4b751b06-bc6c-498d-aa92-2c7f1678a595"
  // vc pode fazer:
  // const id = orderId.replace("item-", "")
  // e passar: JSON.stringify({orderId: id})
  
  // enviando o id pedido para deletá-lo no backend
  const response = await fetch(`/api/teams/${slug}/order`, {
       method: "DELETE",
       headers: {"content-type": "application/json"},
       body: JSON.stringify({orderId: orderId})
  });
  ```
  </details>
  
