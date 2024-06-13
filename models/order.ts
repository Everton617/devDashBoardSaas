import { prisma } from "@/lib/prisma";
interface IOrder {
    id: string;
    pedido: string,
    status: string,
    horario: Date,
    entregador: string
}
export async function createOrder(order: IOrder) {
    return await prisma.order.create({
        data: {
            id: order.id,
            pedido: order.pedido,
            status: order.status,
            horario: order.horario,
            entregador: order.entregador
        }
    });
}

export async function deleteOrder(orderId: string) {
    return await prisma.order.delete({
        where: {id: orderId}
    })
}
