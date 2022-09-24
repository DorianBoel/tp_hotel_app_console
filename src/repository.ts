import * as fs from "fs";

function read(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile("clients.json", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

async function write(json: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile("./clients.json", json, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

async function getClientJsonData(): Promise<string> {
    let buffer: Buffer = await read();
    return buffer.toString();
}

export { getClientJsonData, write };
