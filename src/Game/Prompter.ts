import readline from "readline"

interface StartPromptProps {
	message: string
	controlTokens: number
	hands?: string[]
	recruits?: { quanity: number; type: string }[]
	discards?: { quanity: number; type: string }[]
}

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

	public async promptStart(props: StartPromptProps): Promise<string> {
		this.printInfo(props.controlTokens, props.hands, props.recruits, props.discards)

		return new Promise((resolve) => {
			this.rl.question(props.message, (answer) => {
				resolve(answer)
			})
		})
	}

	private printInfo(
		controlTokens: number,
		hands?: string[],
		recruits?: { quanity: number; type: string }[],
		discards?: { quanity: number; type: string }[]
	): void {
		const recruitsToPrint = recruits
			? recruits.map((recruit) => `${recruit.quanity} ${recruit.type}`).join(", ")
			: ""

		const discardsToPrints = discards
			? discards.map((discard) => `${discard.quanity} ${discard.type}`).join(", ")
			: ""
		const handsToPrint = hands ? hands.join(", ") : ""

		const handInfo = `Hand: ${handsToPrint}`

		const recruitInfo = `Recruitment pieces: ${recruitsToPrint}`

		const discardInfo = `Discard pile:  ${discardsToPrints}`

		const controlTokenInfo = `Control tokens: ${controlTokens}`

		const printAbleInfo = [handInfo, recruitInfo, discardInfo, controlTokenInfo].join("\n")

		console.log(printAbleInfo)
	}
}
