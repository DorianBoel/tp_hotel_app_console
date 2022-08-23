import { MenuLineMap } from "./definitions";
import { Client } from "./domain";

function display(message: string): void {
    console.log(message);
    console.log();
}

function displayMenu(menuLines: MenuLineMap): void {
    console.log("Choisissez un option :");
    for (let line in menuLines) {
        console.log(` ${line}. ${menuLines[line].opt}`);
    }
    console.log();
}

function displayClientList(clients: Client[]): void {
    for (let client of clients) {
        console.log(` ${client.getFullName()}`)
    }
    console.log();
}

export {
    display,
    displayMenu,
    displayClientList
};
