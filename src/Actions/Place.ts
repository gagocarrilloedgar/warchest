import { Board } from "../Board/Board"
import { Player } from "../Player/Player"
import { Position } from "../shared/Position"
import { Prompter, PromptQuestion } from "../shared/Prompter"
import { Unit } from "../Unit/Unit"
import { UnitType, UnitTypes } from "../Unit/UnitType"
import { Action, ActionType, ActionTypes } from "./Action"

class PlaceError extends Error {
	constructor(message: string) {
		super(`PlaceError: ${message}`)
	}
}

export class Place implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.PLACE)
	private readonly propmpter: Prompter

	private readonly WHERE_TO_PLACE: string = "Where do you want to place your unit? (y,x)"
	private readonly WHICH_UNIT: string = "Which unit from your hand do you want to place?"

	constructor() {
		this.propmpter = new Prompter()
	}

	public async execute(board: Board, player: Player, propmpter: PromptQuestion): Promise<void> {
		try {
			const hand = player.playerInfo.hand

			const unitTypeString = await propmpter.prompt(this.WHICH_UNIT)

			const unitType = UnitType.fromValue(unitTypeString.toUpperCase() as UnitTypes)

			const availableTypes = hand
				.map((type: UnitType) => type.value)
				.filter((value) => value !== UnitTypes.ROYAL)

			const isAvailable = availableTypes.includes(unitType.value)

			if (!isAvailable) {
				throw new PlaceError("Unit not available in hand.")
			}

			const newUnit = new Unit(unitType)

			const answer2 = await propmpter.prompt(this.WHERE_TO_PLACE)

			const [x, y] = answer2.split(",").map((value) => parseInt(value, 10))

			const isPosible = this.checkIfPositionHasAdjacentControlZone(player.playerInfo.name, board, {
				x,
				y
			})

			if (!isPosible) {
				throw new PlaceError("Position is not adjacent to any of your units.")
			}

			player.removeUnit(newUnit)
			player.placeUnitOnBoard(new Unit(unitType), { x, y })
			board.placeUnitOnBoard(new Unit(unitType), { x, y }, player)
		} catch (error: PlaceError | unknown) {
			if (error instanceof PlaceError) {
				console.log(error.message)
			}
			await this.execute(board, player, propmpter)
		}
	}

	private checkIfPositionHasAdjacentControlZone(
		playerName: string,
		board: Board,
		position: Position
	): boolean {
		const { x, y } = position

		const tableBoard = board.getBoard

		const leftPosition =
			x - 1 >= 0 && tableBoard[x - 1][y].controlledBy?.playerInfo.name === playerName

		const rightPosition =
			x + 1 < tableBoard.length && tableBoard[x + 1][y].controlledBy?.playerInfo.name === playerName

		const topPosition =
			y - 1 >= 0 && tableBoard[x][y - 1].controlledBy?.playerInfo.name === playerName

		const bottomPosition =
			y + 1 < tableBoard[0].length &&
			tableBoard[x][y + 1].controlledBy?.playerInfo.name === playerName

		return leftPosition || rightPosition || topPosition || bottomPosition
	}
}
