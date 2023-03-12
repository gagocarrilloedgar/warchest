import { Action, ActionTypes } from "./Action"

export class PlaceAction extends Action {
	constructor() {
		super(ActionTypes.PLACE)
	}

	execute(): void {
		console.log("Place action executed")
	}
}
