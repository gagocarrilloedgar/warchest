import { Action, ActionType, ActionTypes } from "./Action"

export class Attack implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.ATTACK)

	public async execute(): Promise<void> {
		console.log("Move action executed")
		await Promise.resolve()
	}
}
