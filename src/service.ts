import { display } from "./display";
import { Client, ClientDTO } from "./domain";
import { getClientJsonData, write } from "./repository";
import { capitalize } from "./utils";

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

async function getHighestId(): Promise<number> {
    let clients: Client[] = await getAllClients();
    let clientsId: number[] = clients.map((client) => client.id);
    return clientsId.reduce((max: number, cur: number) => {
        return max > cur ? max : cur;
    }, 0);
}

async function autoIncrementId(): Promise<number> {
    let id: number = await getHighestId();
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

async function addClient(obj: { firstName: string; lastName: string; }): Promise<void> {
    getClientJsonData().then(
        async (clientData) => {
            let client: Client = new Client(await autoIncrementId(), capitalize(obj.firstName), capitalize(obj.lastName));
            let clients: ClientDTO[] = JSON.parse(clientData);
            if (Array.isArray(clients)) {
                clients.push(client.toDTO());
            } else {
                throw "err";
            }
            write(JSON.stringify(clients, null, "    "));
        }
    ).catch((err) => {
        console.log(err);
    });
}

export { getAllClients, searchClient, addClient };
