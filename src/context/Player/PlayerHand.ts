import { Unit, UnitType } from "../Unit"
import { PlayerBag } from "./PlayerBag"

export class PlayerHand {
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

	public removeUnit(unitType: UnitType): void {
		// find the first unit that matches the type
		const index = this.units.findIndex(
			(unitInHand: Unit) => unitInHand.type.value === unitType.value
		)

		if (index > -1) {
			this.units.splice(index, 1)
		}
	}

	public getUnitsCount(): number {
		return this.units.length
	}

	public refillHand(bag: PlayerBag): void {
		const availableAtHand = this.getUnitsCount()

		if (availableAtHand < 3) {
			const toRefill = 3 - availableAtHand
			const newUnits = bag.getRandomUnits(toRefill)
			newUnits.forEach((unit) => {
				this.addUnit(unit)
			})
		}
	}

	public addUnit(unit: Unit): void {
		if (this.units.length < this.MAX_UNITS) {
			this.units.push(unit)
		}
	}

	public containsUnitType(unitType: UnitType): boolean {
		return this.getUnitTypesAvailable()
			.map((type) => type.value)
			.includes(unitType.value)
	}
}
