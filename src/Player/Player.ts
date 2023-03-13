import { ActionType, ActionTypes } from "../Actions/Action"
import { ActionFactory } from "../Actions/ActionFactory"
import { Board } from "../Board/Board"
import { PromptQuestion } from "../shared/Prompter"
import { Unit } from "../Unit/Unit"
import { UnitType, UnitTypes } from "../Unit/UnitType"
import { Hand } from "./Hand"
import { PlayerBag } from "./PlayerBag"
import { PlayerRecruitment, UnitCollection } from "./PlayerRecruitment"

export interface PlayerTurnInfo {
	name: string
	controlTokens: number
	hand: UnitType[]
	recruits: UnitCollection[]
	discards: { quanity: number; type: string }[]
}

export class Player {
	private readonly hand: Hand
	private readonly recruits: PlayerRecruitment
	private readonly discards: { quanity: number; type: string }[]
	private readonly controlTokens: number
	private readonly name: string
	private readonly bag: PlayerBag
	private readonly UNITS_FOR_THE_BAG = 2
	private readonly unitsInBoard: {
		position: {
			x: number
			y: number
		}
		unit: Unit
	}[]

	constructor(name: string, conrolTokens: number, playerTypes: UnitTypes[]) {
		this.name = name
		this.unitsInBoard = []
		this.recruits = new PlayerRecruitment(playerTypes, this.UNITS_FOR_THE_BAG)
		this.bag = new PlayerBag(playerTypes, this.UNITS_FOR_THE_BAG)
		this.hand = new Hand(this.bag.getThreeRandomUnits())

		this.discards = []
		this.controlTokens = conrolTokens
	}

	public get playerInfo(): PlayerTurnInfo {
		return {
			name: this.name,
			controlTokens: this.controlTokens,
			hand: this.hand.getUnitTypesAvailable(),
			recruits: this.recruits.getAvailableUnits(),
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

			await this.askQuestion(action.movements, answers, propmpter, board)

			await action.execute(answers, board, this)
		} catch (error: Error | unknown) {
			if (error instanceof Error) {
				console.log(error.message)
			}
			await this.nextAction(board, actionType, propmpter)
		}

		return true
	}

	public placeUnitOnBoard(unit: Unit, position: { x: number; y: number }): void {
		this.unitsInBoard.push({ position, unit })
	}

	public removeUnit(unit: Unit): void {
		this.hand.removeSelectedUnit(unit)
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
