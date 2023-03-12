import { Board } from "../Board/Board"
import { Player } from "../Player/Player"
import { Prompter } from "./Prompter"

export class Game {
	private readonly MAX_CONTROL_TOKENS = 3

	private readonly prompter: Prompter
	private readonly board: Board
	private readonly wolf: Player
	private readonly crown: Player

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
		const playerInfo = this.playerTurn.getPlayerInfo()
		console.log(this.board.createDrawableBoard())
		console.log(this.board.hashTagSeparator(playerInfo.name))
	}

	public async play(): Promise<void> {
		await this.prompter.promptStart({
			message: "Select an action: (move, recruit, place, attack, control, initiative, forfeit): ",
			playerInfo: this.playerTurn.getPlayerInfo()
		})
	}

	private swithPlayerTurn(): void {
		this.playerTurn === this.wolf ? (this.playerTurn = this.crown) : (this.playerTurn = this.wolf)
	}
}
