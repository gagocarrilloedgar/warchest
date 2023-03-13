import { PlayerDiscards, PlayerHand, PlayerRecruitment, PlayerTurnInfo } from "../Player"
import { Prompter } from "../shared"
import { UnitType } from "../Unit"

interface StartPromptProps {
	message: string
	playerInfo: PlayerTurnInfo
}

export class GamePrompter extends Prompter {
	public async promptAction(props: StartPromptProps): Promise<string> {
		this.printInfo(
			props.playerInfo.controlTokens,
			props.playerInfo.hand,
			props.playerInfo.recruits,
			props.playerInfo.discards
		)

		return this.prompt(props.message)
	}

	private printInfo(
		controlTokens: number,
		hands?: PlayerHand,
		recruits?: PlayerRecruitment,
		discards?: PlayerDiscards
	): void {
		const recruitsToPrint = recruits
			? recruits
					.getAvailableUnits()
					.map((recruit) => `${recruit.count} ${this.capitalize(recruit.unit.type.value)}`)
					.join(", ")
			: ""

		const discardsToPrints = discards
			? discards
					.getAvailableUnits()
					.map((discard) => `${discard.count} ${this.capitalize(discard.unit.type.value)}`)
					.join(", ")
			: ""

		const handsToPrint = hands
			? hands
					.getUnitTypesAvailable()
					.map((unitType: UnitType) => this.capitalize(unitType.value))
					.join(", ")
			: ""

		const handInfo = `Hand: ${handsToPrint}`

		const recruitInfo = `Recruitment pieces: ${recruitsToPrint}`

		const discardInfo = `Discard pile:  ${discardsToPrints}`

		const controlTokenInfo = `Control tokens: ${controlTokens}`

		const printAbleInfo = [handInfo, recruitInfo, discardInfo, controlTokenInfo].join("\n")

		console.log(printAbleInfo)
	}

	private capitalize(string: string): string {
		if (!string) {
			return string
		}

		return string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1)
	}
}
