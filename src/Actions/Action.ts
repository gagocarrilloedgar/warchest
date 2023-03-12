export const enum ActionTypes {
	PLACE = "place",
	MOVE = "move",
	RECRUIT = "recruit",
	ATTACK = "attack",
	CONTROL = "control",
	INITIATIVE = "initiative",
	FORFEIT = "forfeit"
}

export abstract class Action {
	private readonly type: ActionTypes

	constructor(type: ActionTypes) {
		this.type = type
	}

	abstract execute(): void
}
