import { MenuLineMap } from "../library/definitions";
import { display, displayClientList, displayMenu } from "../utils/display";
import { Client } from "../library/domain";
import { isOn, prompt, promptClientInfo, promptSearch, rlOff } from "../services/readline";
import { addClient, getAllClients, searchClient } from "../services/client-service";

const REDISPLAY_LINE: string = "M pour réafficher le menu";

const MENU_LINES: MenuLineMap = {
    1: {
        opt: "Lister les clients",
        fn: async (): Promise<void>  => {
            console.log("Liste des clients :");
            displayClientList(await getAllClients());
            display(REDISPLAY_LINE);
        }
    },
    2: {
        opt: "Ajouter un client",
        fn: async (): Promise<void> => {
            display("Complétez les informations suivantes pour ajouter un client:");
            await promptClientInfo().then(
                (obj) => obj,
                (err): void => {
                    if (err === "exit") {
                        displayMenu(MENU_LINES);
                        throw "";
                    }
                }
            ).then(
                (obj) => {
                    if (obj) {
                        return addClient(obj);
                    }
                },
                (err) => {
                    throw err;
                }
            ).then(
                (client) => {
                    if (client) {
                        display(`\nNouveau client ajouté: ${client.getFullName()}`);
                        console.log("2 pour ajouter un autre client");
                        display(REDISPLAY_LINE);
                    }
                },
                (err) => {
                    throw err;
                }
            ).catch((err) => {
                if (err) {
                    display(err);
                }
                return;
            });
        }
    },
    3: {
        opt: "Rechercher un client par nom",
        fn: async (): Promise<void> => {
            await promptSearch().then(
                (query: string): Promise<Client> => {
                    return searchClient(query);
                }, (err): void => {
                    if (err === "exit") {
                        displayMenu(MENU_LINES);
                        throw "";
                    }
                }
            ).then(
                (result: Client | void): void => {
                    display(`Client trouvé: ${result?.getFullName()}`);
                    console.log("3 pour effectuer une nouvelle recherche");
                    display(REDISPLAY_LINE);
                }, (err) => {
                    console.log("3 pour effectuer une nouvelle recherche");
                    display(REDISPLAY_LINE);
                }
            ).catch((err) => {
                if(err) {
                    display(err);
                }
            });
        }
    },
    9: {
        opt: "Quitter"
    },
    M: {
        opt: "Réafficher ce menu",
        fn: async (): Promise<void> => displayMenu(MENU_LINES)
    }
}

async function start(): Promise<void> {
    display("** Administration Hotel **");
    displayMenu(MENU_LINES);
    while (isOn()) {
        await prompt().then(
            async (option: string | number) => await selectOption(option),
            (err) => {
                throw err;
            }
        ).then(
            async (fn) => {
                if (fn instanceof Function) {
                    await fn();
                }
            },
            (err) => {
                throw err;
            }
        ).catch((err) => {
            if (err === "exit") {
                rlOff();
            } else {
                display(err);
            }
        });
    }
}

function selectOption(index: number | string): Promise<Function | undefined> {
    return new Promise((resolve, reject) => {
        if (index in MENU_LINES) {
            let line = MENU_LINES[index];
            resolve(line.fn);
            return;
        };
        reject("Option invalide");
    });
}

export { start };
