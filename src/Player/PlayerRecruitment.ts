import { Unit } from "../Unit/Unit"
import { UnitType, UnitTypes } from "../Unit/UnitType"

export interface UnitCollection {
	count: number
	unit: Unit
}

export class PlayerRecruitment {
	units: UnitCollection[]

	constructor(unitTypes: UnitTypes[], unitsToDiscount: number) {
		this.units = unitTypes.map((type: UnitTypes) => {
			const newUnit = new Unit(UnitType.fromValue(type))

			return {
				count: newUnit.max - unitsToDiscount,
				unit: newUnit
			}
		})
	}

	getAvailableUnits(): UnitCollection[] {
		return this.units
	}
}
