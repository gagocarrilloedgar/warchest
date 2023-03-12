import { Action, ActionTypes } from "./Action"

export class MoveAction extends Action {
	constructor() {
		super(ActionTypes.PLACE)
	}

	execute(): void {
		console.log("Move action executed")
	}
}
