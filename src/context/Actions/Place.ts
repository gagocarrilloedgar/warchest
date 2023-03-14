import { Board } from "../Board"
import { Player } from "../Player"
import { Position } from "../shared"
import { Unit, UnitType, UnitTypes } from "../Unit"
import { Action, ActionType, ActionTypes } from "./Action"

class PlaceError extends Error {
	constructor(message: string) {
		super(`PlaceError: ${message}`)
	}
}

export class Place implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.PLACE)
	public readonly movements = [
		"Which unit from your hand do you want to place?: ",
		"Where do you want to place your unit? (y,x): "
	]

	public execute(answers: string[], board: Board, player: Player): void {
		const hand = player.playerInfo.hand

		const unitTypeString = answers[0]
		const answer2 = answers[1]

		const unitType = UnitType.fromValue(unitTypeString.toUpperCase() as UnitTypes)

		const availableTypes = hand
			.getUnitTypesAvailable()
			.map((type: UnitType) => type.value)
			.filter((value) => value !== UnitTypes.ROYAL)

		const isAvailable = availableTypes.includes(unitType.value)

		if (!isAvailable) {
			throw new PlaceError("Unit not available in hand.")
		}

		const newUnit = new Unit(unitType)

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
