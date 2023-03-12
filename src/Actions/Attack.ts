import { Action, ActionType, ActionTypes } from "./Action"

export class Attack implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.ATTACK)

	public execute(): void {
		console.log("To be implemented")
	}
}
