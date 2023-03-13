import { JsonDbUserRepository } from "../inftastructure/JsonDbUserRepository"

export class GetPrintedUsers {
	repository: JsonDbUserRepository

	constructor() {
		this.repository = new JsonDbUserRepository()
	}

	public async execute(): Promise<string> {
		const users = await this.repository.find()

		if (users.length > 0) {
			const strinUsers = users.map((user) => user.toPrint())

			return strinUsers.join("\n")
		}

		return "No users found"
	}
}
