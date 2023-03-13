import { Action, ActionType, ActionTypes } from "./Action"

export class Control implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.CONTROL)

	movements: string[] = []

	public async execute(): Promise<void> {
		console.log("Move action executed")
		await Promise.resolve()
	}
}
