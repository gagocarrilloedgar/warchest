import { Action, ActionType, ActionTypes } from "./Action"

export class Move implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.MOVE)

	public async execute(): Promise<void> {
		console.log("Move action executed")
		await Promise.resolve()
	}
}
