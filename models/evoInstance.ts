import { ApiError } from "@/lib/errors";
import { updateTeam } from "./team";
import { slugify } from "@/lib/server-common";

const EVOLUTION_URL = "https://apiaec.qu1ckai.com";
const EVOLUTION_API_KEY = "6c4aaabbdf7d1f0562efef4c2b444ae2";
const EVOLUTION_WEBHOOK_URL = "https://bonekazz.app.n8n.cloud/webhook-test/send-message";
const evoHeaders = {apiKey: EVOLUTION_API_KEY, "Content-Type": "application/json"}; 

export async function createEvoInstance(teamName: string) {
    const response = await fetch(`${EVOLUTION_URL}/instance/create`, {
        headers: evoHeaders,
        method: "POST",
        body: JSON.stringify({
            instanceName: teamName,
            webhook: EVOLUTION_WEBHOOK_URL,
            webhook_by_events: true,
            events: ["SEND_MESSAGE"]
        })
    });
    if (!response.ok) throw new ApiError(response.status, "error creating instance ..");
    const data = await response.json();
    console.log(data);
    const newTeam = await updateTeam(slugify(teamName),{evo_instance_key: data.hash.apikey});
    
    return {
        mod_team: {...newTeam},
        team_evo_instance: {...data}
    }
}

export async function deleteEvoInstance(instanceName: string) {
    console.log(`deleting -> ${instanceName} ...`);
    const response = await fetch(`${EVOLUTION_URL}/instance/delete/${instanceName}`, {
        headers: evoHeaders,
        method: "DELETE",
    });

    if (!response.ok) throw new ApiError(response.status, "error creating instance ..");
    const data = await response.json();
    console.log(data);

    return data;
}
