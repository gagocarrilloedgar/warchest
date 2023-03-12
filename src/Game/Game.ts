import { ActionType } from "../Actions/Action"
import { Board } from "../Board/Board"
import { Player } from "../Player/Player"
import { Prompter } from "./Prompter"

export class Game {
	private readonly MAX_CONTROL_TOKENS = 3
	private readonly MAX_QUESTIONS = 2

	private readonly prompter: Prompter
	private readonly board: Board
	private readonly wolf: Player
	private readonly crown: Player

	private selectedAction: ActionType | undefined
	private questionCount = this.MAX_QUESTIONS

	private playerTurn: Player

	constructor() {
		this.prompter = new Prompter()
		this.board = new Board(5)

		this.wolf = new Player("wolf", this.MAX_CONTROL_TOKENS)
		this.crown = new Player("crown", this.MAX_CONTROL_TOKENS)
		this.playerTurn = this.wolf

		this.initGame()
	}

	public initGame(): void {
		this.drawPlayerWithBoard()
	}

	public async play(): Promise<void> {
		try {
			const answer = await this.askQuestion()
			this.selectedAction = ActionType.fromString(answer)
			const nextAction = this.playerTurn.nextAction(this.selectedAction)
			this.playerForfeits(!nextAction)

			if (this.questionCount > 0) {
				this.questionCount--
				this.drawPlayerWithBoard()
				await this.play()
			} else {
				this.swithPlayerTurn()
				this.drawPlayerWithBoard()
				await this.play()
			}
		} catch (error: unknown) {
			this.drawInvalidAction()
			await this.play()
		}
	}

	private drawInvalidAction(): void {
		const spaces = " ".repeat(4)
		const arrayOfInfo = [spaces, "Invalid action, please try again", spaces]
		console.log(arrayOfInfo.join("\n"))
	}

	private drawPlayerWithBoard(): void {
		const playerInfo = this.playerTurn.getPlayerInfo()
		console.log(this.board.createDrawableBoard())
		console.log(this.board.hashTagSeparator(playerInfo.name))
	}

	private playerForfeits(hasForfeit: boolean) {
		if (hasForfeit) {
			const playerWinner = this.playerTurn === this.wolf ? this.crown : this.wolf
			console.log(`Player ${playerWinner.getPlayerInfo.name} has won the game!`)
			this.prompter.close()
		}
	}

	private async askQuestion(): Promise<string> {
		return await this.prompter.promptAction({
			message: "Select an action: (move, recruit, place, attack, control, initiative, forfeit): ",
			playerInfo: this.playerTurn.getPlayerInfo()
		})
	}

	private swithPlayerTurn(): void {
		this.playerTurn === this.wolf ? (this.playerTurn = this.crown) : (this.playerTurn = this.wolf)
		this.questionCount = this.MAX_QUESTIONS
	}
}
