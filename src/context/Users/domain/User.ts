// To add more semantic and domain logic we could create value objects for the needed properties (email, name, id, etc.)F
export class User {
	id: string
	name: string
	victoriesCount: number
	updatedAt: Date

	constructor(id: string, name: string, victoresCount: number, updatedAt: Date) {
		this.id = id
		this.name = name
		this.updatedAt = updatedAt
		this.victoriesCount = victoresCount
	}

	static fromPrimitives(id: string, name: string, victoriesCount: number, updatedAt: Date): User {
		return new User(id, name, victoriesCount, updatedAt)
	}

	toPrint(): string {
		return `"${this.name}", ${this.victoriesCount}, ${this.updatedAt.toLocaleDateString()}`
	}
}
