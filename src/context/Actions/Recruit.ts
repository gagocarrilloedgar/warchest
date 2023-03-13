import { Board } from "../Board"
import { Player } from "../Player"
import { Unit, UnitType, UnitTypes } from "../Unit"
import { Action, ActionType, ActionTypes } from "./Action"

class RecruitError extends Error {
	constructor(message: string) {
		super(`RecruitError: ${message}`)
	}
}

export class Recruit implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.RECRUIT)

	movements: string[] = [
		"Enter the name of the unit you want to discard: ",
		"Enter the name of the unit you want to recruit: "
	]

	public async execute(
		answers: string[],
		board?: Board | undefined,
		player?: Player | undefined
	): Promise<void> {
		try {
			const unitToDiscardString = answers[0]
			const unitToRecruitString = answers[1]

			const unitToRecruit = UnitType.fromValue(unitToRecruitString.toUpperCase() as UnitTypes)
			const unitToDiscard = UnitType.fromValue(unitToDiscardString.toUpperCase() as UnitTypes)

			const hand = player?.playerInfo.hand
			const recruit = player?.playerInfo.recruits
			const discard = player?.playerInfo.discards

			const handAvailableTypes = hand?.getUnitTypesAvailable().map((type) => type.value)

			const recruitAvailableTypes = recruit?.getAvailableUnitTypes()

			const isAvailable = handAvailableTypes?.includes(unitToDiscard.value)
			const isRecruitAvailable = recruitAvailableTypes?.includes(unitToRecruit.value)

			if (!isAvailable) {
				throw new RecruitError("Unit not available in hand.")
			}

			if (!isRecruitAvailable) {
				throw new RecruitError("Unit not available in recruits.")
			}

			// Remove the unit from recruitment and added to the discard pile
			recruit?.removeUnit(unitToRecruit)
			player?.getBag.addUnit(unitToRecruit)

			// Add the selected unit to the player's bag and remove it from the hand
			hand?.removeSelectedUnit(Unit.fromValue(unitToDiscard.value))
			discard?.addUnit(unitToDiscard)
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message)
				await this.execute(answers, board, player)
			}
		}
	}
}
