import { Position } from "../shared/Position"
import { UnitType, UnitTypes } from "./UnitType"

export interface MoveOrAttack {
	move(): void
	attack(): void
}

export class Unit {
	public position: Position | null
	public readonly type: UnitType
	public readonly MAX: number

	constructor(type: UnitType) {
		this.type = type
		this.MAX = type.getMaxCount()
		this.position = null
	}

	static fromValue(value: UnitTypes): Unit {
		const unitType = UnitType.fromValue(value)

		return new Unit(unitType)
	}

	public get max(): number {
		return this.MAX
	}

	private move(position: Position): void {
		this.position = position
	}
}

export class Archer extends Unit {
	constructor() {
		super(UnitType.fromValue(UnitTypes.ARCHER))
	}
}

export class Swordsman extends Unit {
	constructor() {
		super(UnitType.fromValue(UnitTypes.SWORDSMAN))
	}
}
export class Berserker extends Unit {
	constructor() {
		super(UnitType.fromValue(UnitTypes.BERSERKER))
	}
}
export class Mercenary extends Unit {
	constructor() {
		super(UnitType.fromValue(UnitTypes.MERCENARY))
	}
}
export class Royal extends Unit {
	constructor() {
		super(UnitType.fromValue(UnitTypes.ROYAL))
	}
}

export class UnitFactory {
	public static createUnit(type: UnitTypes): Unit {
		switch (type) {
			case UnitTypes.ARCHER:
				return new Archer()
			case UnitTypes.SWORDSMAN:
				return new Swordsman()
			case UnitTypes.BERSERKER:
				return new Berserker()
			case UnitTypes.MERCENARY:
				return new Mercenary()
			case UnitTypes.ROYAL:
				return new Royal()
		}
	}
}
