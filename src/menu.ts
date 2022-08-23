import { createInterface } from "readline";
import { getAllClients } from "./service";
import { display, displayMenu, displayClientList } from "./display";

const REDISPLAY_LINE = "M pour réafficher le menu";

const RL = createInterface({ 
    input: process.stdin,
    output: process.stdout
});

const MENU_LINES: any = {
    1: {
        opt: "Lister les clients",
        fn: () => {
            console.log("Liste des clients :");
            displayClientList(getAllClients());
            display(REDISPLAY_LINE);
        }
    },
    3: {
        opt: "Rechercher un client par nom",
        fn: async () => {
            await promptSearch().then(
                (query: any) => {
                    return searchClient(query);
                }, (err) => {
                    if (err === "exit") {
                        displayMenu(MENU_LINES);
                    }
                }
            ).then(
                (result) => {
                    display(`Client trouvé: ${clientToString(result)}`);
                    console.log("3 pour effectuer une nouvelle recherche");
                    display(REDISPLAY_LINE);
                }, (err) => {
                    console.log("3 pour effectuer une nouvelle recherche");
                    display(REDISPLAY_LINE);
                }
            ).catch((err) => {
                display(err);
            });
        }
    },
    9: {
        opt: "Quitter"
    },
    M: {
        opt: "Réafficher ce menu",
        fn: () => displayMenu(MENU_LINES)
    }
}

let rlSwitch = true;

async function start() {
    display("** Administration Hotel **");
    displayMenu(MENU_LINES);
    while (rlSwitch) {
        await prompt().then(
            (option) => selectOption(option),
            (err) => {
                throw err;
            }
        ).then(
            (fn) => {
                if (fn instanceof Function) {
                    fn();
                }
            },
            (err) => {
                throw err;
            }
        ).catch((err) => {
            if (err === "exit") {
                rlSwitch = false;
            } else {
                display(err);
            }
        });
    }
}

function prompt() {
    return new Promise((resolve, reject) => {      
        RL.question("> ", (answer) => {
            answer = answer.trim();
            if (answer === "9") {
                rlSwitch = false;
                RL.close();
                display("Au revoir");
                reject("exit");
                return;
            }
            resolve(answer);
        });
    });
}

function selectOption(index: any) {
    return new Promise((resolve, reject) => {
        if (index in MENU_LINES) {
            let line = MENU_LINES[index];
            resolve(line.fn);
            return;
        };
        reject("Option invalide");
    });
}

function promptSearch() {
    return new Promise((resolve, reject) => {
        RL.question(
            "Rentrez le nom ou prénom d'un client :\n\n> ",
            (answer) => {
                answer = answer.trim();
                if (!answer) {
                    reject("exit");
                    return;
                }
                resolve(answer);
            }
        );
    });
}

function searchClient(query: string) {
    return new Promise((resolve, reject) => {
        let clients = getAllClients();
        for (let client of clients) {
            if (client.nom.toLowerCase() === query.toLowerCase() || client.prenom.toLowerCase() === query.toLowerCase()) {
                resolve(client);
                return;
            }
        }
        display(`0 résultat trouvé pour "${query}"`);
        reject();
    })
}

function clientToString(client: any) {
    if (!client.nom || !client.prenom) {
        throw "Erreur : données client incomplètes";
    }
    return `${client.nom.toUpperCase()} ${client.prenom}`;
}

export { start };
