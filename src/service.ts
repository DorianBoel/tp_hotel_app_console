import clientData from "../clients.json";
import { display } from "./display";
import { Client } from "./domain";

function getAllClients(): Client[] {
    let clients: Client[] = new Array<Client>();
    for (let client of clientData) {
        clients.push(new Client(client.id, client.prenom, client.nom));
    };
    return clients;
}

function searchClient(query: string): Promise<Client> {
    return new Promise((resolve, reject) => {
        let clients: Client[] = getAllClients();
        for (let client of clients) {
            if (client.lastName.toLowerCase() === query.toLowerCase() || client.firstName.toLowerCase() === query.toLowerCase()) {
                resolve(client);
                return;
            }
        }
        display(`0 résultat trouvé pour "${query}"`);
        reject();
    })
}

export { getAllClients, searchClient };
