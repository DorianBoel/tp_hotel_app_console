import { createInterface } from "readline";
import { menuLines, display, displayMenu } from "./display.js";

const rl = createInterface({ 
    input: process.stdin,
    output: process.stdout
});

function start() {
    console.log("** Administration Hotel **");
    displayMenu();
    prompt();
}

function prompt() {
    rl.question(
        "",
        (answer) => {
            if (answer === "99") {
                rl.close();
                display("Au revoir");
                return;
            }
            selectOption(answer);
            prompt();
        }
    );
}

function selectOption(index) {
    if (index in menuLines) {
        let line = menuLines[index];
        if (line.fn !== undefined) {
            line.fn();
            return;
        }
        display(line.message);
        return;
    };
    display("Option invalide");
    return;
}

export { start };
