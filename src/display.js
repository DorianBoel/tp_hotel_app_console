const menuLines = {
    1: {
        opt: "Lister les clients",
        message: "Liste des clients"
    },
    99: {
        opt: "Sortir",
        message: "Au revoir"
    },
    M: {
        opt: "Réafficher ce menu",
        fn: () => displayMenu()
    }
}

function display(message) {
    console.log(message);
    console.log();
}

function displayMenu() {
    for (let line in menuLines) {
        console.log(`${line}. ${menuLines[line].opt}`);
    }
    console.log();
}

export {
    menuLines,
    display,
    displayMenu
};
