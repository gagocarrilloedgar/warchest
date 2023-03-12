import { Prompter } from "./Prompter"

export class Game {
	private readonly prompter: Prompter

	constructor() {
		this.prompter = new Prompter()
	}

	public async play(): Promise<void> {
		const controlTokens = 10
		const hands = ["1", "2", "3"]
		const recruits = [
			{ quanity: 1, type: "1" },
			{ quanity: 2, type: "2" }
		]
		const discards = [
			{ quanity: 3, type: "3" },
			{ quanity: 4, type: "4" }
		]

		await this.prompter.promptStart({
			message: "Select an action: (move, recruit, place, attack, control, initiative, forfeit): ",
			controlTokens,
			hands,
			recruits,
			discards
		})
	}
}
