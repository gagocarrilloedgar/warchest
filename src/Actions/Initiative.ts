import { Action, ActionType, ActionTypes } from "./Action"

export class Initiative implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.INITIATIVE)

	public async execute(): Promise<void> {
		console.log("Move action executed")
		await Promise.resolve()
	}
}
