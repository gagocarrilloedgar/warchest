import { Action, ActionType, ActionTypes } from "./Action"

export class Place implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.PLACE)

	public execute(): void {
		console.log("To be implemented")
	}
}
