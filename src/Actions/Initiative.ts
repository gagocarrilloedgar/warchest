import { Action, ActionType, ActionTypes } from "./Action"

export class Initiative implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.INITIATIVE)

	public execute(): void {
		console.log("To be implemented")
	}
}
