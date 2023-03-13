import { UnitCollection } from "../shared"
import { Unit, UnitType, UnitTypes } from "../Unit"

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

	getAvailableUnitTypes(): UnitTypes[] {
		return this.units.map((unit: UnitCollection) => unit.unit.type.value)
	}

	removeUnit(unitType: UnitType): void {
		const unit = this.units.find((unit: UnitCollection) => {
			const unitTypeSelected = UnitType.fromValue(unit.unit.type.value)

			return unitTypeSelected.value === unitType.value
		})

		if (unit && unit.count > 0) {
			const index = this.units.indexOf(unit)

			if (index > -1) {
				this.units[index].count--
			}
		}
	}
}
