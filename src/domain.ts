export interface ClientDTO {
    id: number,
    nom: string,
    prenom: string
}

export class Client {

    static fromDTO(clientDTO: ClientDTO) {
        return new this(clientDTO.id, clientDTO.prenom, clientDTO.nom);
    } 

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

    toDTO(): ClientDTO {
        return {
            id: this._id,
            nom: this._lastName,
            prenom: this._firstName
        }
    }

} 
