import { Position } from "../shared/Position"
import { UnitType, UnitTypes } from "./UnitType"

export interface MoveOrAttack {
	move(): void
	attack(): void
}

export class Unit {
	protected static readonly max: number

	public position: Position | null
	public readonly type: UnitType

	constructor(type: UnitType) {
		this.type = type
		this.position = null
	}

	static fromValue(value: UnitTypes): Unit {
		const unitType = UnitType.fromValue(value)

		return new Unit(unitType)
	}

	private move(position: Position): void {
		this.position = position
	}
}
