import { Action, ActionType, ActionTypes } from "./Action"
import { Attack } from "./Attack"
import { Control } from "./Control"
import { Initiative } from "./Initiative"
import { Move } from "./Move"
import { Place } from "./Place"
import { Recruit } from "./Recruit"

export class ActionFactory {
	static create(actionType: ActionType): Action {
		switch (actionType.value) {
			case ActionTypes.MOVE:
				return new Move()
			case ActionTypes.PLACE:
				return new Place()
			case ActionTypes.CONTROL:
				return new Control()
			case ActionTypes.ATTACK:
				return new Attack()
			case ActionTypes.INITIATIVE:
				return new Initiative()
			case ActionTypes.RECRUIT:
				return new Recruit()
			default:
				throw new Error("Invalid action type")
		}
	}
}
