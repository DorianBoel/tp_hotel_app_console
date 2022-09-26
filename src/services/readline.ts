import { Interface, createInterface } from "readline";
import { display } from "../utils/display";

const RL: Interface = createInterface({ 
    input: process.stdin,
    output: process.stdout
});

let rlSwitch: boolean = true;

function isOn() {
    return rlSwitch;
}

function rlOff(): void {
    rlSwitch = false;
}

function prompt(): Promise<string | number> {
    return new Promise((resolve, reject) => {      
        RL.question("> ", (answer: string) => {
            answer = answer.trim();
            if (answer === "9") {
                rlOff();
                RL.close();
                display("Au revoir");
                reject("exit");
                return;
            }
            resolve(answer);
        });
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

function promptName(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
        RL.question(
            `${message}: `,
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

function promptClientInfo(): Promise<{firstName: string, lastName: string}> {
    return new Promise(async (resolve, reject) => {
        try {
            let firstName: string = await promptName("Prénom");
            let lastName: string = await promptName("Nom de famille");
            resolve({
                firstName,
                lastName
            });
        } catch (err) {
            reject(err);
        }
    });
}

export { isOn, rlOff, prompt, promptSearch, promptClientInfo };
