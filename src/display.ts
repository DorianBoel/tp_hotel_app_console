function display(message: string) {
    console.log(message);
    console.log();
}

function displayMenu(menuLines: any) {
    console.log("Choisissez un option :");
    for (let line in menuLines) {
        console.log(` ${line}. ${menuLines[line].opt}`);
    }
    console.log();
}

function displayClientList(clients: any) {
    for (let client of clients) {
        console.log(` ${client.nom.toUpperCase()} ${client.prenom}`)
    }
    console.log();
}

export {
    display,
    displayMenu,
    displayClientList
};
