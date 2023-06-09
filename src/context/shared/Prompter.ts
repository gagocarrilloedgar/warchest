import readline from "readline"

export interface PromptQuestion {
	prompt(message: string): Promise<string>
	close(): void
}

export class Prompter {
	private readonly primary = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	constructor() {
		this.primary.on("close", () => {
			process.exit(0)
		})
	}

	public async prompt(message: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.primary.question(message, (answer) => {
				try {
					resolve(answer)
				} catch (error) {
					reject("Invalid input")
				}
			})
		})
	}

	public close(): void {
		this.primary.close()
	}
}
