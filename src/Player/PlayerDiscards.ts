import { Unit } from "../Unit/Unit"
import { UnitType, UnitTypes } from "../Unit/UnitType"

export interface UnitCollection {
	count: number
	unit: Unit
}

export class PlayerDiscards {
	units: UnitCollection[]

	constructor() {
		this.units = []
	}

	getAvailableUnits(): UnitCollection[] {
		return this.units
	}

	getAvailableUnitTypes(): UnitTypes[] {
		return this.units.map((unit: UnitCollection) => unit.unit.type.value)
	}

	removeUnit(unitType: UnitType): void {
		const unit = this.units.find((unit: UnitCollection) => unit.unit.type === unitType)

		if (unit && unit.count > 0) {
			this.units[this.units.indexOf(unit)].count--
		}
	}

	addUnit(unitType: UnitType): void {
		const unit = this.units.find((unit: UnitCollection) => unit.unit.type === unitType)

		if (unit) {
			this.units[this.units.indexOf(unit)].count++
		} else {
			this.units.push({
				count: 1,
				unit: new Unit(unitType)
			})
		}
	}
}
