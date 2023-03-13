import { Unit } from "../Unit/Unit"
import { UnitType } from "../Unit/UnitType"
import { PlayerBag } from "./PlayerBag"

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
		const index = this.units.indexOf(unit)
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
}
