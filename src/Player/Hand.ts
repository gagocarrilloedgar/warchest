import { Unit } from "../Unit/Unit"
import { UnitType } from "../Unit/UnitType"

export class Hand {
	private readonly units: Unit[] = []
	private readonly MAX_UNITS = 3

	constructor(availableUnits: Unit[]) {
		this.units = availableUnits
	}

	public getUnitTypesAvailable(): UnitType[] {
		return this.units.map((unit: Unit) => unit.type)
	}

	public getUnits(): Unit[] {
		return this.units
	}

	public removeSelectedUnit(unit: Unit): void {
		this.units.splice(this.units.indexOf(unit), 1)
	}
}
