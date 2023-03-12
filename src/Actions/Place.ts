import { Prompter } from "../shared/Prompter"
import { Action, ActionType, ActionTypes } from "./Action"

export class Place implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.PLACE)
	private readonly propmpter: Prompter

	private readonly WHERE_TO_PLACE: string = "Where do you want to place your unit?"
	private readonly WHICH_UNIT: string = "Which unit from your hand do you want to place?"

	constructor() {
		this.propmpter = new Prompter()
	}

	public async execute(): Promise<void> {
		const answer = await this.propmpter.prompt(this.WHICH_UNIT)

		console.log(answer)
	}
}
