import type { NextApiRequest, NextApiResponse } from "next";
import { throwIfNoTeamAccess} from "models/team";

import { 
    IOrder,
    createOrder,
    deleteOrder,
    getOrders,
    updateOrder
} from "models/order";

// import { sendAudit } from "@/lib/retraced";
// import { throwIfNotAllowed } from "models/user";

import { createOrderSchema, updateOrderSchema, validateWithSchema } from "@/lib/zod";
import { defaultHeaders } from "@/lib/common";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const { teamId, user } = await throwIfNoTeamAccess(req, res);
        console.log(user);

        switch (req.method) {
            case "GET":
                await handleGET(req, res, teamId);
                break;
            case "POST":
                await handlePOST(req, res, teamId, user);
                break;
            case "PUT":
                await handlePUT(req, res, teamId);
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
        console.log("error-message: ", message);
        res.status(status).json({error: {message}});
    }

}


async function validateCEPExistence(cep: string) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`,{headers: defaultHeaders});
    const data = await response.json();
    if (data.erro) throw new Error("CEP does not exist!");
}

async function handleGET(req: NextApiRequest, res: NextApiResponse, teamId: string) {
    // throw if not allowed

    const orders = Array.from( await getOrders(teamId))

    console.log("got orders successfuly");
    console.log(orders);

    return res.status(200).json({orders: orders});
}

const testUpdateOrder = {
    id: "348452ac-895f-429f-a460-3f72ccc903f8",
    pedido: "3x pastel de uva",
    quantidade: 2,
    status: "ANDAMENTO",
    entregador: "Marcelo",
    rua: "Alameda",
    numero: "12",
    complemento: "perto dali",
    cep: "59158-210",
    cidade: "Natal",
    estado: "RN",
    tel: "(84) 98752-2972",
    metodo_pag: "cartao",
    instrucoes: "sem tijoloa"
}

const testNewOrder = {
    pedido: "3x pastel de uva",
    quantidade: 2,
    status: "ANDAMENTO",
    entregador: "Marcelo",
    rua: "Alameda",
    numero: "12",
    complemento: "perto dali",
    cep: "59158-210",
    cidade: "Natal",
    estado: "RN",
    tel: "(84) 98752-2972",
    metodo_pag: "cartao",
    instrucoes: "sem tijoloa"
}

const inDev = false;


async function handlePOST(
    req: NextApiRequest,
    res: NextApiResponse,
    teamId: string,
    user: any
){

    // throw if not allowed?
    
    if (!req.body.order) throw new Error("Order not provided");

    const reqOrder = inDev ? validateWithSchema(createOrderSchema,testNewOrder) : validateWithSchema(createOrderSchema, req.body.order); // validate cep and phone inside

     await validateCEPExistence(reqOrder.cep);

    const order = {
       ...reqOrder,
       horario: new Date(),
       createdBy: user.name,
       teamId: teamId,
       userId: user.id
    } as IOrder;

   const newOrder = await createOrder(order);

    // sendAudit({
    //     action: "order.create",
    //     crud: "c",
    //     user: user,
    //     team: team
    //  })
   //  recordMetric()
    
    console.log("Order created!");
    console.log(newOrder);
    return res.json({data: newOrder, message: "order created!"});


}

async function handlePUT(req: NextApiRequest, res: NextApiResponse, teamId: string) {

    if (!req.body.order) throw new Error("Order not provided");

    const reqOrder = inDev ? validateWithSchema(updateOrderSchema, testUpdateOrder) : 
         validateWithSchema(updateOrderSchema, req.body.order); 

    const order = {
       id: reqOrder.id.replace("item-", ""),
       teamId: teamId
    } as IOrder;

   const newOrder = await updateOrder(order);

    // sendAudit({
    //     action: "order.create",
    //     crud: "c",
    //     user: user,
    //     team: team
    //  })
   //  recordMetric()
    
    console.log("Order updated!");
    console.log(newOrder);
    return res.json({message: "order updated successfuly"});
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse){
   
    // const user = await getCurrentUserWithTeam(req, res);
    // throwIfNotAllowed(user, "order", "create");

    await deleteOrder(req.body.orderId);

    return res.json({message: "order deleted successfuly"});

}
