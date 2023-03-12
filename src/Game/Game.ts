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
		const answer = await this.askQuestion()
		console.log({ answer, questionCount: this.questionCount })

		if (this.questionCount > 0) {
			this.questionCount--
			this.drawPlayerWithBoard()
			await this.play()
		} else {
			this.swithPlayerTurn()
			this.drawPlayerWithBoard()
			await this.play()
		}
	}

	private drawPlayerWithBoard(): void {
		const playerInfo = this.playerTurn.getPlayerInfo()
		console.log(this.board.createDrawableBoard())
		console.log(this.board.hashTagSeparator(playerInfo.name))
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
