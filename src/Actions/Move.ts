import { Action, ActionType, ActionTypes } from "./Action"

export class Move implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.MOVE)

	public execute(): void {
		console.log("To be implemented")
	}
}
