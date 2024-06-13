import type { NextApiRequest, NextApiResponse } from "next";
import { 
    getCurrentUserWithTeam,
    throwIfNoTeamAccess,
} from "models/team";
import { 
    createOrder,
    deleteOrder
} from "models/order";
import { throwIfNotAllowed } from "models/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        // await throwIfNoTeamAccess(req, res);

        switch (req.method) {
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
        console.log("cant reach rout");
        res.status(status).json({error: {message}});
    }

}


async function handlePOST(req: NextApiRequest, res: NextApiResponse){
   
    // const user = await getCurrentUserWithTeam(req, res);
    // throwIfNotAllowed(user, "order", "create");
    //
    console.log(req.body.order);
    const {id, pedido, status, entregador} = req.body.order;
    const order = {
        id: id,
        pedido: pedido,
        status: status,
        horario: new Date(),
        entregador: entregador
    }

    const newOrder = await createOrder(order);

    return res.json({data: newOrder});


}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse){
   
    // const user = await getCurrentUserWithTeam(req, res);
    // throwIfNotAllowed(user, "order", "create");
    //

    await deleteOrder(req.body.orderId);

    return res.json({message: "order deleted successfuly"});

}
