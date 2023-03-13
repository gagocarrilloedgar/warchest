// If we had more use cases we could create a generic repository that would implements by the specific ones
import { Config, JsonDB } from "node-json-db"

import { User } from "../domain"

export class JsonDbUserRepository {
	private readonly db: JsonDB

	constructor() {
		this.db = new JsonDB(new Config("data/users.json", true, false, "/"))
	}

	async find(): Promise<User[] | []> {
		const users = (await this.db.getData("/")) as User[]

		return users.map((user) =>
			User.fromPrimitives(user.id, user.name, user.victoriesCount, user.updatedAt)
		)
	}
}
