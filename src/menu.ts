import { createInterface, Interface } from "readline";
import { getAllClients, searchClient } from "./service";
import { display, displayMenu, displayClientList } from "./display";
import { Client } from "./domain";
import { MenuLineMap } from "./definitions";

const REDISPLAY_LINE: string = "M pour réafficher le menu";

const RL: Interface = createInterface({ 
    input: process.stdin,
    output: process.stdout
});

const MENU_LINES: MenuLineMap = {
    1: {
        opt: "Lister les clients",
        fn: async (): Promise<void>  => {
            console.log("Liste des clients :");
            displayClientList(getAllClients());
            display(REDISPLAY_LINE);
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

let rlSwitch: boolean = true;

async function start(): Promise<void> {
    display("** Administration Hotel **");
    displayMenu(MENU_LINES);
    while (rlSwitch) {
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
                rlSwitch = false;
            } else {
                display(err);
            }
        });
    }
}

function prompt(): Promise<string | number> {
    return new Promise((resolve, reject) => {      
        RL.question("> ", (answer: string) => {
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

function selectOption(index: number | string) {
    return new Promise((resolve, reject) => {
        if (index in MENU_LINES) {
            let line = MENU_LINES[index];
            resolve(line.fn);
            return;
        };
        reject("Option invalide");
    });
}

function promptSearch(): Promise<string> {
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
                return;
            }
        );
    });
}

export { start };
