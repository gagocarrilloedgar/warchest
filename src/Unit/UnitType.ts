import { EnumValueObject } from "../shared/EnumValueObject"

export enum UnitTypes {
	ARCHER = "ARCHER",
	BERSERKER = "BERSERKER",
	MERCENARY = "MERCENARY",
	SWORDSMAN = "SWORDSMAN",
	ROYAL = "ROYAL"
}

export enum UnitAcronyms {
	ARCHER = "Ar",
	BERSERKER = "Be",
	MERCENARY = "Me",
	SWORDSMAN = "Sw",
	ROYAL = "Ro"
}

export class UnitType extends EnumValueObject<UnitTypes> {
	constructor(value: UnitTypes) {
		super(value, Object.values(UnitTypes))
	}

	static fromValue(value: UnitTypes): UnitType {
		return new UnitType(value)
	}

	public getAcronym(): UnitAcronyms {
		return UnitAcronyms[this.value]
	}

	protected throwErrorForInvalidValue(value: UnitTypes): void {
		throw new Error(`Invalid unit type: ${value}`)
	}
}
