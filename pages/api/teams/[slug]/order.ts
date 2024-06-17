import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

import { 
    getCurrentUserWithTeam,
    getTeam,
    throwIfNoTeamAccess,
} from "models/team";

import { 
    EOrderStatus,
    IOrder,
    createOrder,
    deleteOrder,
    getOrders
} from "models/order";

import { sendAudit } from "@/lib/retraced";

import { getCurrentUser, throwIfNotAllowed } from "models/user";
import { teamSlugSchema, validateWithSchema } from "@/lib/zod";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const { teamId } = await throwIfNoTeamAccess(req, res);

        switch (req.method) {
            case "GET":
                await handleGET(req, res, teamId);
                break;
            case "POST":
                await handlePOST(req, res, teamId);
                break;
            case "PUT":
                break;
            case "DELETE":
                await handleDELETE(req, res);
                break;
            default: 
        }
    } catch (error: any) {
        const message = error.message || "Somethin went wrong";
        const status = error.status || 500;
        console.log("cant reach route");
        console.log("erro-message: ", message);
        res.status(status).json({error: {message}});
    }

}

function validateOrder(order: any) {
    if (
        ("status" in order && typeof order.status === "string") &&
        ("entregador" in order && typeof order.entregador === "string") &&
        ("rua" in order && typeof order.rua === "string") &&
        ("numero" in order && typeof order.numero === "string") &&
        ("complemento" in order && typeof order.complemento === "string") &&
        ("cep" in order && typeof order.cep === "string") &&
        ("cidade" in order && typeof order.cidade === "string") &&
        ("estado" in order && typeof order.estado === "string") &&
        ("tel" in order && typeof order.tel === "string") &&
        ("metodo_pag" in order && typeof order.metodo_pag === "string") &&
        ("instrucoes" in order && typeof order.instrucoes === "string")
    ) return order;

    throw new Error("Invalid Order");
}

async function handleGET(req: NextApiRequest, res: NextApiResponse, teamId: string) {
    // throw if not allowed

    const orders = Array.from( await getOrders(teamId))

    console.log("got orders successfuly");
    console.log(orders);

    return res.status(200).json({orders: orders});
}


async function handlePOST(req: NextApiRequest, res: NextApiResponse, teamId: string){

    // throw if not allowed?
    
    if (!req.body.order) throw new Error("Order not provided");

    const testOrder = {
        status: "ANDAMENTO",
        entregador: "vini",
        rua: "Alameda",
        numero: "12",
        complemento: "perto dali",
        cep: "532",
        cidade: "Natal",
        estado: "RN",
        tel: "6969",
        metodo_pag: "cartao",
        instrucoes: "sem tijolo"
    }

    const { 
        status,
        entregador,
        rua,
        numero,
        complemento,
        cep,
        cidade,
        estado,
        tel,
        metodo_pag,
        instrucoes
     } = validateOrder(testOrder) || validateOrder(req.body.order);

     if (!EOrderStatus[status as keyof typeof EOrderStatus])
         throw new Error("Invalid Status type");

    // validate cep
    // validate tel

    const order = {
       status: status,
       horario: new Date(),
       entregador: entregador,
       rua: rua,
       numero: numero,
       complemento,
       cep: cep,
       cidade: cidade,
       estado: estado,
       tel: tel,
       metodo_pag: metodo_pag,
       instrucoes: instrucoes,

       teamId: teamId
    } as IOrder;

   const newOrder = await createOrder(order);

    // sendAudit({
    //     action: "order.create",
    //     crud: "c",
    //     user: user,
    //     team: team
    //  })
    
    console.log("Order created!");
    console.log(newOrder);
    // console.log(`team name ==> ${team.name}`)
    return res.json({data: newOrder, message: "order created!"});


}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse){
   
    // const user = await getCurrentUserWithTeam(req, res);
    // throwIfNotAllowed(user, "order", "create");

    await deleteOrder(req.body.orderId);

    return res.json({message: "order deleted successfuly"});

}
