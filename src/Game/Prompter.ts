import readline from "readline"

export class Prompter {
	private readonly rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	constructor() {
		this.rl.on("close", () => {
			process.exit(0)
		})
	}

	public async prompt(message: string): Promise<string> {
		return new Promise((resolve) => {
			this.rl.question(message, (answer) => {
				resolve(answer)
			})
		})
	}

	public close(): void {
		this.rl.close()
	}
}
