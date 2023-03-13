import { Action, ActionType, ActionTypes } from "./Action"

export class Recruit implements Action {
	public readonly type: ActionType = new ActionType(ActionTypes.RECRUIT)

	movements: string[] = []

	public async execute(): Promise<void> {
		console.log("Move action executed")
		await Promise.resolve()
	}
}
