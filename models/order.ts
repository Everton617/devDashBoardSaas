import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export enum EOrderStatus {
    BACLOG = "BACLOG" ,
    ANDAMENTO = "ANDAMENTO" ,
    ENTREGA = "ENTREGA" ,
    CONCLUIDO = "CONCLUIDO" ,
};
export interface IOrder {
    id?: string,
    pedido: string,
    status: OrderStatus,
    horario: Date,
    entregador: string,
    rua: string,
    numero: string,
    complemento: string,
    cep: string,
    cidade: string,
    estado: string,
    tel: string,
    metodo_pag: string,
    instrucoes: string,
    createdBy: string,

    teamId: string,
    userId: string
};

export async function createOrder(order: IOrder) {
    return await prisma.order.create({
        data: order
    });
}

export async function deleteOrder(orderId: string) {
    return await prisma.order.delete({
        where: {id: orderId}
    })
}

export async function updateOrder(order: IOrder){
    return await prisma.order.update({
        where: {id: order.id},
        data: order
    })
}

export async function getOrders(teamId: string) {
    return await prisma.order.findMany({
        where: {teamId: teamId},
        select: {
            id: true,
            pedido: true,
            quantidade: true,
            status: true,
            entregador: true,
            rua: true,
            numero: true,
            complemento: true,
            cep: true,
            cidade: true,
            estado: true,
            tel: true,
            metodo_pag: true,
            instrucoes: true,
            createdBy: true,
        }
    })
}
