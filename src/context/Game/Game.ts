import { ActionType } from "../Actions"
import { Board } from "../Board"
import { Player } from "../Player"
import { UnitTypes } from "../Unit"
import { GamePrompter } from "./GamePrompter"

export class Game {
	private readonly MAX_CONTROL_TOKENS = 3
	private readonly MAX_QUESTIONS = 2
	private readonly MAX_UNITS_PER_PLAYER = 2
	private readonly MAX_TURNES = 1
	private readonly aviailableUnits: UnitTypes[]
	private readonly wolf: Player
	private readonly crown: Player
	private readonly board: Board
	private readonly prompter: GamePrompter

	private selectedAction: ActionType | undefined
	private questionCount = this.MAX_QUESTIONS
	private playerTurn: Player

	constructor(usersList: string) {
		this.board = new Board(5)
		this.aviailableUnits = Object.values(UnitTypes).filter(
			(type: UnitTypes) => type !== UnitTypes.ROYAL
		)

		this.prompter = new GamePrompter()

		const wolfUnits = this.randomizeUnits()
		const leftUnits = this.randomizeUnits()

		this.wolf = new Player("wolf", this.MAX_CONTROL_TOKENS, wolfUnits)
		this.crown = new Player("crown", this.MAX_CONTROL_TOKENS, leftUnits)

		this.playerTurn = this.wolf

		this.board.addControlledZones(this.wolf, this.crown)
		this.showPreviousUsers(usersList)
		this.initGame()
	}

	public initGame(): void {
		this.drawPlayerWithBoard(true)
	}

	public randomizeUnits = (): UnitTypes[] => {
		const unitsToReturn: UnitTypes[] = []

		for (let i = 0; i < this.MAX_UNITS_PER_PLAYER; i++) {
			const randomIndex = Math.floor(Math.random() * this.aviailableUnits.length)
			const randomUnitType = this.aviailableUnits[randomIndex]
			this.aviailableUnits.splice(randomIndex, 1)
			unitsToReturn.push(randomUnitType)
		}

		return unitsToReturn
	}

	public async play(): Promise<void> {
		try {
			const answer = await this.askQuestion()
			this.selectedAction = ActionType.fromString(answer)
			const nextAction = await this.playerTurn.nextAction(
				this.board,
				this.selectedAction,
				this.prompter
			)

			this.playerForfeits(!nextAction)

			if (this.questionCount > 0) {
				this.questionCount--
				this.drawPlayerWithBoard()
			} else {
				this.playerTurn.refill()
				this.swithPlayerTurn()
				this.drawPlayerWithBoard()
			}
		} catch (error: unknown) {
			this.drawInvalidAction()
		}

		if (this.hasThePlayerWon()) {
			console.log(`Player ${this.playerTurn.playerInfo.name} has won the game`)
			this.prompter.close()
		}

		await this.play()
	}

	private showPreviousUsers(userList: string): void {
		const arrayOfInfo = [
			"",
			"Welcome to the game of the wolf and the crown. Below you can see the previous users that have played this game: ",
			"",
			userList,
			""
		]

		console.log(arrayOfInfo.join("\n"))
	}

	private drawInvalidAction(): void {
		const spaces = " ".repeat(4)
		const arrayOfInfo = [spaces, "Invalid action, please try again", spaces]
		console.log(arrayOfInfo.join("\n"))
	}

	private hasThePlayerWon(): boolean {
		const playersControlZones = this.board.getControlledZones()
		const isWolfPlaying = this.playerTurn.playerInfo.name === this.wolf.playerInfo.name

		const hasTheCurrentPlayerWon = isWolfPlaying
			? playersControlZones.wolf === this.MAX_CONTROL_TOKENS
			: playersControlZones.crown === this.MAX_CONTROL_TOKENS

		// Here we still need to add the recruitment logic (if empty hands or recruitment zone is empty the other players should win)
		return hasTheCurrentPlayerWon
	}

	private drawPlayerWithBoard(init?: boolean): void {
		const playerInfo = this.playerTurn.playerInfo
		console.log(this.board.createDrawableBoard(init))
		console.log(this.board.hashTagSeparator(playerInfo.name))
	}

	private playerForfeits(hasForfeit: boolean) {
		if (hasForfeit) {
			const playerWinner = this.playerTurn === this.wolf ? this.crown : this.wolf
			console.log(`Player ${playerWinner.playerInfo.name} has won the game!`)
			this.prompter.close()
		}
	}

	private async askQuestion(): Promise<string> {
		return await this.prompter.promptAction({
			message: "Select an action: (move, recruit, place, attack, control, initiative, forfeit): ",
			playerInfo: this.playerTurn.playerInfo
		})
	}

	private swithPlayerTurn(): void {
		const wolfIntiativeToken = this.wolf.getInitiative()
		const crownIntiativeToken = this.crown.getInitiative()

		const diff = wolfIntiativeToken - crownIntiativeToken

		if (diff === 0) {
			this.playerTurn = this.playerTurn === this.wolf ? this.crown : this.wolf
		} else if (diff > 0) {
			this.playerTurn = this.crown
		} else {
			this.playerTurn = this.wolf
		}

		this.questionCount = this.MAX_QUESTIONS
	}
}
