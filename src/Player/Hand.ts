import { Unit, UnitFactory } from "../Unit/Unit"
import { UnitType, UnitTypes } from "../Unit/UnitType"

export class Hand {
	private readonly units: Unit[] = []
	private readonly MAX_UNITS = 3

	constructor() {
		this.addThreeUnitsRandomUnits()
	}

	public addThreeUnitsRandomUnits(): void {
		const options = Object.values(UnitTypes)

		while (this.units.length < this.MAX_UNITS) {
			const randomIndex = Math.floor(Math.random() * options.length)
			const newUnit = UnitFactory.createUnit(options[randomIndex])
			if (this.units.indexOf(newUnit) === -1) {
				this.units.push(newUnit)
			}
		}
	}

	public getUnitTypesAvailable(): UnitType[] {
		return this.units.map((unit: Unit) => unit.type)
	}
}
