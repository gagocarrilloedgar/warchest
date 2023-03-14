import { Board } from "../Board"
import { Player } from "../Player"
import { BoardPosition } from "../shared"
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

	public execute(answers: string[], player: Player, board: Board): void {
		const unitTypeString = answers[0]
		const positionString = answers[1]
		const position = BoardPosition.fromString(positionString)

		const unitType = UnitType.fromValue(unitTypeString.toUpperCase() as UnitTypes)

		const isRoyal = unitType.value === UnitTypes.ROYAL

		const newUnit = new Unit(unitType)

		if (isRoyal) {
			throw new PlaceError("You cannot place a royal unit.")
		}

		if (!player.handContainsUnit(unitType)) {
			throw new PlaceError("Unit not available in hand.")
		}

		if (!board.hasPositionAdjacentControlZone(position, player.getName)) {
			throw new PlaceError("Position is not adjacent to any of your units.")
		}

		player.removeUnit(newUnit.type)
		board.placeUnitOnBoard(new Unit(unitType), position)
	}
}
