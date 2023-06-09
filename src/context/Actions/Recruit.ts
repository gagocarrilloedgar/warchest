import { Player } from "../Player"
import { UnitType, UnitTypes } from "../Unit"
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

	public execute(answers: string[], player: Player): void {
		const unitToDiscardString = answers[0]
		const unitToRecruitString = answers[1]

		const unitToRecruit = UnitType.fromValue(unitToRecruitString.toUpperCase() as UnitTypes)
		const unitToDiscard = UnitType.fromValue(unitToDiscardString.toUpperCase() as UnitTypes)

		const hand = player.playerInfo.hand
		const recruit = player.playerInfo.recruits

		const handAvailableTypes = hand.getUnitTypesAvailable().map((type) => type.value)

		const recruitAvailableTypes = recruit.getAvailableUnitTypes()

		const isAvailable = handAvailableTypes.includes(unitToDiscard.value)
		const isRecruitAvailable = recruitAvailableTypes.includes(unitToRecruit.value)

		if (!isAvailable) {
			throw new RecruitError("Unit not available in hand.")
		}

		if (!isRecruitAvailable) {
			throw new RecruitError("Unit not available in recruits.")
		}

		// Remove the unit from recruitment and added to the discard pile
		player.recruit(unitToRecruit, unitToDiscard)
	}
}
