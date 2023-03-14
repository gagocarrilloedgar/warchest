import { ActionFactory, ActionType, ActionTypes } from "../Actions"
import { Board } from "../Board"
import { PromptQuestion } from "../shared"
import { Unit, UnitType, UnitTypes } from "../Unit"
import { PlayerBag } from "./PlayerBag"
import { PlayerDiscards } from "./PlayerDiscards"
import { PlayerHand } from "./PlayerHand"
import { PlayerRecruitment } from "./PlayerRecruitment"

export interface PlayerTurnInfo {
	name: string
	controlTokens: number
	hand: PlayerHand
	recruits: PlayerRecruitment
	discards: PlayerDiscards
}

export class Player {
	private readonly UNITS_FOR_THE_BAG = 2

	private readonly hand: PlayerHand
	private readonly recruits: PlayerRecruitment
	private readonly discards: PlayerDiscards
	private readonly controlTokens: number
	private readonly name: string
	private readonly bag: PlayerBag
	private readonly unitsInBoard: {
		position: {
			x: number
			y: number
		}
		unit: Unit
	}[]

	private initiativeToken = 0

	constructor(name: string, conrolTokens: number, playerTypes: UnitTypes[]) {
		this.name = name
		this.unitsInBoard = []
		this.recruits = new PlayerRecruitment(playerTypes, this.UNITS_FOR_THE_BAG)
		this.bag = new PlayerBag(playerTypes, this.UNITS_FOR_THE_BAG)
		this.hand = new PlayerHand(this.bag.getRandomUnits(3))
		this.discards = new PlayerDiscards()
		this.controlTokens = conrolTokens
	}

	public get playerInfo(): PlayerTurnInfo {
		return {
			name: this.name,
			controlTokens: this.controlTokens,
			hand: this.hand,
			recruits: this.recruits,
			discards: this.discards
		}
	}

	public async nextAction(
		board: Board,
		actionType: ActionType,
		propmpter: PromptQuestion
	): Promise<boolean> {
		if (actionType.value === ActionTypes.FORFEIT) {
			console.log(`Player ${this.name} has forfeited the game!`)

			return false
		}

		try {
			const action = ActionFactory.create(actionType)
			const answers: string[] = []

			// Ask the questions
			await this.askQuestion(action.movements, answers, propmpter, board)

			action.execute(answers, this, board)
		} catch (error: Error | unknown) {
			if (error instanceof Error) {
				console.log(error.message)
			}
			await this.nextAction(board, actionType, propmpter)
		}

		return true
	}

	public get getName(): string {
		return this.name
	}

	public refill(): void {
		this.hand.refillHand(this.bag)
	}

	public addInitiativeToken(): void {
		this.initiativeToken = 1
	}

	public removeInitiativeToken(): void {
		this.initiativeToken = 0
	}

	public getInitiative(): number {
		return this.initiativeToken
	}

	public removeUnit(unitType: UnitType): void {
		this.hand.removeUnit(unitType)
	}

	public discardUnit(unitType: UnitType): void {
		this.hand.removeUnit(unitType)
		this.discards.addUnit(unitType)
	}

	public removeControlToken(): void {
		this.controlTokens - 1
	}

	public handContainsUnit(unitType: UnitType): boolean {
		return this.hand.containsUnitType(unitType)
	}

	public recruit(unitToRecruit: UnitType, unitToDiscard: UnitType): void {
		this.recruits.removeUnit(unitToRecruit)
		this.bag.addUnit(unitToRecruit)
		this.discardUnit(unitToDiscard)
	}

	private async askQuestion(
		questions: string[],
		answers: string[],
		propmpter: PromptQuestion,
		board: Board
	): Promise<void> {
		if (questions.length > 0) {
			const question = questions.shift() as string

			const answer = await propmpter.prompt(question)
			answers.push(answer)

			await this.askQuestion(questions, answers, propmpter, board)
		}
	}
}
