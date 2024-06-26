import { ApiError } from "@/lib/errors";
import { updateTeam } from "./team";
import { slugify } from "@/lib/server-common";

const EVOLUTION_WEBHOOK_URL = "https://bonekazz.app.n8n.cloud/webhook-test/send-message";

export async function createEvoInstance(teamName: string) {
    const response = await fetch("https://apiaec.qu1ckai.com/instance/create", {
        headers: {apiKey: "6c4aaabbdf7d1f0562efef4c2b444ae2", "Content-Type": "application/json"},
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
