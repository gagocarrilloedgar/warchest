import { Position } from "../shared/Position"
import { UnitType, UnitTypes } from "./UnitType"

export enum Directions {
	ORTHOGONAL = "ORTHOGONAL",
	DIAGONAL = "DIAGONAL"
}

export interface MoveOrAttack {
	move(): void
	attack(): void
}

export class Unit {
	public deltaMove = 1
	public deltaAttack = 1
	public moveDirection: Directions = Directions.ORTHOGONAL
	public attackDirection: Directions = Directions.ORTHOGONAL
	public attackTimes = 1
	public actions = 1

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

	public move(): void {
		console.log("Unit moved")
	}

	public attack(): void {
		console.log("Unit attacked")
	}
}

export class Archer extends Unit {
	deltaMove = 1
	deltaAttack = 2
	moveDirection = Directions.ORTHOGONAL
	attackDirection = Directions.DIAGONAL
	attackTimes = 1
	actions = 1

	constructor() {
		super(UnitType.fromValue(UnitTypes.ARCHER))
	}

	public move(): void {
		console.log("Archer moved")
	}
}

export class Swordsman extends Unit {
	deltaMove = 1
	deltaAttack = 1
	moveDirection = Directions.ORTHOGONAL
	attackDirection = Directions.ORTHOGONAL
	attackTimes = 1
	actions = 2

	constructor() {
		super(UnitType.fromValue(UnitTypes.SWORDSMAN))
	}
}
export class Berserker extends Unit {
	deltaMove = 1
	deltaAttack = 1
	moveDirection = Directions.ORTHOGONAL
	attackDirection = Directions.ORTHOGONAL
	attackTimes = 2
	actions = 1

	constructor() {
		super(UnitType.fromValue(UnitTypes.BERSERKER))
	}
}
export class Mercenary extends Unit {
	deltaMove = 1
	deltaAttack = 1
	moveDirection = Directions.ORTHOGONAL
	attackDirection = Directions.ORTHOGONAL
	attackTimes = 1
	actions = 1

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
