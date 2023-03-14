import { Board } from "../Board"
import { Player } from "../Player"
import { EnumValueObject } from "../shared"

export enum ActionTypes {
	PLACE = "place",
	MOVE = "move",
	RECRUIT = "recruit",
	ATTACK = "attack",
	CONTROL = "control",
	INITIATIVE = "initiative",
	FORFEIT = "forfeit"
}

export class ActionType extends EnumValueObject<ActionTypes> {
	constructor(value: ActionTypes) {
		super(value, Object.values(ActionTypes))
	}

	public static fromString(value: string): ActionType {
		return new ActionType(ActionTypes[value.toUpperCase() as keyof typeof ActionTypes])
	}

	protected throwErrorForInvalidValue(value: ActionTypes): void {
		throw new Error(`Invalid action type: ${value}`)
	}
}

export interface Action {
	movements: string[]
	execute(answers: string[], board: Board, player: Player): Promise<void> | void
}
