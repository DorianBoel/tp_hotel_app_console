export class Client {

    constructor(private _id: number, private _firstName: string, private _lastName: string) { }

    get id(): number {
        return this._id;
    }

    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    getFullName(): string {
        return `${this._lastName.toUpperCase()} ${this._firstName}`;
    }

} 
