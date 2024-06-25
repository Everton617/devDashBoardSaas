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
import { ApiError } from "@/lib/errors";

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
                await handlePUT(req, res);
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
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) throw new ApiError(404, "CEP does not exist!");

    return {
        rua: data.logradouro,
        cidade: data.localidade,
        estado: data.uf
    }
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
    numero: "12",
    complemento: "perto dali",
    cep: "59158-210",
    tel: "(84) 98752-2972",
    metodo_pag: "cartao",
    instrucoes: "sem tijoloa"
}

const testNewOrder = {
    pedido: "3x pastel de uva",
    quantidade: 2,
    status: "ANDAMENTO",
    entregador: "Marcelo",
    numero: "12",
    complemento: "perto dali",
    cep: "59158-210",
    tel: "(84) 98752-2972",
    metodo_pag: "cartao",
    instrucoes: "sem tijoloa"
}

const inDev = true;


async function handlePOST(
    req: NextApiRequest,
    res: NextApiResponse,
    team_id: string,
    user: any
){

    // throw if not allowed?
    
    if (!req.body.order) throw new Error("Order not provided");

    const reqOrder = inDev ? validateWithSchema(createOrderSchema,testNewOrder) : validateWithSchema(createOrderSchema, req.body.order); // validate cep and phone inside

    const address = await validateCEPExistence(reqOrder.cep);

    const order = {
       ...reqOrder,
       ...address,
       horario: new Date(),
       createdBy: user.name,
       teamId: team_id,
       userId: user.id
    } as IOrder;

   const newOrder = await createOrder(order);
   const data: Record<string, string | number | Date> = {};
   Object.entries(newOrder).forEach(([key, value]) => {
       if (key !== "teamId" && key !== "userId" && key !== "createdAt" && key !== "updatedAt") {
           data[key] = value;
       }
   })
   console.log(data)

    // sendAudit({
    //     action: "order.create",
    //     crud: "c",
    //     user: user,
    //     team: team
    //  })
   //  recordMetric()
    
    console.log("Order created!");
    console.log(newOrder);
    return res.json({data: data, message: "order created!"});


}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {

    if (!req.body.order) throw new Error("Order not provided");

    const reqOrder = inDev ? validateWithSchema(updateOrderSchema, testUpdateOrder) : 
         validateWithSchema(updateOrderSchema, req.body.order); 

    const order = {
       id: reqOrder.id,
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
   
    // throwIfNotAllowed(user, "order", "delete");
    
    const orderId = req.body.orderId;
    if (!orderId) throw new ApiError(406, "Order id not provided")

    await deleteOrder(orderId);

    return res.json({message: "order deleted successfuly"});

}
