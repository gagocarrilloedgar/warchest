import { Action, ActionType, ActionTypes } from "./Action"

export class Control implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.CONTROL)

	public execute(): void {
		console.log("To be implemented")
	}
}
