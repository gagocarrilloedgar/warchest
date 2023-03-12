import { PlayerTurnInfo } from "../Player/Player"
import { UnitCollection } from "../Player/PlayerRecruitment"
import { Prompter } from "../shared/Prompter"
import { UnitType } from "../Unit/UnitType"

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
		hands?: UnitType[],
		recruits?: UnitCollection[],
		discards?: { quanity: number; type: string }[]
	): void {
		const recruitsToPrint = recruits
			? recruits.map((recruit) => `${recruit.count} ${recruit.unit.type.value}`).join(", ")
			: ""

		const discardsToPrints = discards
			? discards.map((discard) => `${discard.quanity} ${discard.type}`).join(", ")
			: ""

		const handsToPrint = hands ? hands.map((unitType: UnitType) => unitType.value).join(", ") : ""

		const handInfo = `Hand: ${handsToPrint}`

		const recruitInfo = `Recruitment pieces: ${recruitsToPrint}`

		const discardInfo = `Discard pile:  ${discardsToPrints}`

		const controlTokenInfo = `Control tokens: ${controlTokens}`

		const printAbleInfo = [handInfo, recruitInfo, discardInfo, controlTokenInfo].join("\n")

		console.log(printAbleInfo)
	}
}
