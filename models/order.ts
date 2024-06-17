import { prisma } from "@/lib/prisma";
export enum EOrderStatus {
    BACLOG = "BACLOG" ,
    ANDAMENTO = "ANDAMENTO" ,
    ENTREGA = "ENTREGA" ,
    CONCLUIDO = "CONCLUIDO" ,
};
export interface IOrder {
    status: EOrderStatus,
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

    teamId: string
};

export async function createOrder(order: IOrder) {
    const {
        status,
        horario,
        entregador,
        rua,
        numero,
        complemento,
        cep,
        cidade,
        estado,
        tel,
        metodo_pag,
        instrucoes,
        teamId
    } = order;
    return await prisma.order.create({
        data: {
            status: status,
            horario: horario,
            entregador: entregador,
            rua: rua,
            numero: numero,
            complemento: complemento,
            cep: cep,
            cidade,
            estado: estado,
            tel: tel,
            metodo_pag,
            instrucoes: instrucoes,
            teamId,
        }
    });
}

export async function deleteOrder(orderId: string) {
    return await prisma.order.delete({
        where: {id: orderId}
    })
}

export async function getOrders(teamId: string) {
    return await prisma.order.findMany({
        where: {teamId: teamId}
    })
}
