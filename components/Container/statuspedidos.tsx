

export enum StatusPedido {
    BACKLOG = "BackLog",
    ANDAMENTO = "Em Processo",
    ENTREGA = "Saiu para entrega",
    CONCLUIDO = "Concluído",
    
  }
  

  export const StatusPedidoTitles = {
    [StatusPedido.BACKLOG]: "BackLog",
    [StatusPedido.ANDAMENTO]: "Em Processo",
    [StatusPedido.ENTREGA]: "Saiu para entrega",
    [StatusPedido.CONCLUIDO]: "Concluído",
  };
  