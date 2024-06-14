import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

import { 
    getCurrentUserWithTeam,
    throwIfNoTeamAccess,
} from "models/team";

import { 
    createOrder,
    deleteOrder
} from "models/order";

import { sendAudit } from "@/lib/retraced";

import { throwIfNotAllowed } from "models/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        await throwIfNoTeamAccess(req, res);

        switch (req.method) {
            case "GET":
                await handlePOST(req, res);
                break;
            case "POST":
                await handlePOST(req, res);
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


async function handlePOST(req: NextApiRequest, res: NextApiResponse){
   
    const { user, team } = await getCurrentUserWithTeam(req, res);
    if(!user || !team) throw new Error("no user or no team");
    
    const {id, pedido, status, entregador} = req.body.order;
    if (!id || !pedido || !status || !entregador) throw new Error("invalid object");

    const order = {
        id: id,
        pedido: pedido,
        status: status,
        horario: new Date(),
        entregador: entregador,
        from: team.name,
        managedBy: user.name,

        teamId: team.id,
        userId: user.id
      
    }

    const newOrder = await createOrder(order);

    sendAudit({
        action: "order.create",
        crud: "c",
        user: user,
        team: team
    })

    return res.json({data: newOrder});


}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse){
   
    // const user = await getCurrentUserWithTeam(req, res);
    // throwIfNotAllowed(user, "order", "create");
    //

    await deleteOrder(req.body.orderId);

    return res.json({message: "order deleted successfuly"});

}
