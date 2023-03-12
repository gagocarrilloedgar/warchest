import { Action, ActionType, ActionTypes } from "./Action"

export class Recruit implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.RECRUIT)

	public execute(): void {
		console.log("To be implemented")
	}
}
