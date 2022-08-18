const menuLines = {
    1: "Lister les clients",
    99: "Sortir"
}

function displayMenu() {
    for (let line in menuLines) {
        console.log(`${line}. ${menuLines[line]}`);
    }
}

function start() {
    console.log("** Administration Hotel **");
    displayMenu();
}

exports.start = start;
