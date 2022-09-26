import { display } from "../utils/display";
import { Client, ClientDTO } from "../library/domain";
import { getClientJsonData, write } from "./repository";
import { capitalize } from "../utils/utils";

function getAllClients(): Promise<Client[]> {
    return new Promise(async (resolve, reject) => {
        let clients: Client[] = new Array<Client>();
        let clientData: ClientDTO[] = JSON.parse(await getClientJsonData());
        for (let client of clientData) {
            clients.push(Client.fromDTO(client));
        };
        resolve(clients);
    });
}

async function autoIncrementId(): Promise<number> {
    let id: number;
    let clients: Client[] = await getAllClients();
    let clientsId: number[] = clients.map((client) => client.id);
    id = clientsId.reduce((max: number, cur: number) => {
        return max > cur ? max : cur;
    }, 0);
    return ++id;
}

function searchClient(query: string): Promise<Client> {
    return new Promise(async (resolve, reject) => {
        let clients: Client[] = await getAllClients();
        for (let client of clients) {
            if (client.lastName.toLowerCase() === query.toLowerCase() || client.firstName.toLowerCase() === query.toLowerCase()) {
                resolve(client);
                return;
            }
        }
        display(`0 résultats trouvés pour "${query}"`);
        reject();
    });
}

async function addClient(obj: { firstName: string; lastName: string; }): Promise<Client> {
    return new Promise((resolve, reject) => getClientJsonData().then(
        async (clientData) => {
            let client: Client = new Client(await autoIncrementId(), capitalize(obj.firstName), capitalize(obj.lastName));
            let clients: ClientDTO[] = JSON.parse(clientData);
            if (Array.isArray(clients)) {
                clients.push(client.toDTO());
            } else {
                reject("err");
            }
            write(JSON.stringify(clients, null, "    "));
            resolve(client);
        }
    ));
}

export { getAllClients, searchClient, addClient };
