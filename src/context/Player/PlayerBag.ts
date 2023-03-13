import { UnitCollection } from "../shared"
import { Unit, UnitType, UnitTypes } from "../Unit"

export class PlayerBag {
	private readonly units: UnitCollection[] = []

	private readonly MAX_UNITS_PER_TYPE

	constructor(unitOptions: UnitTypes[], unitsPerType: number) {
		this.MAX_UNITS_PER_TYPE = unitsPerType
		this.initBag(unitOptions)
	}

	public initBag(options: UnitTypes[]): void {
		this.addUnit(UnitType.fromValue(UnitTypes.ROYAL))

		options.forEach((option: UnitTypes) => {
			for (let i = 0; i < this.MAX_UNITS_PER_TYPE; i++) {
				this.addUnit(UnitType.fromValue(option))
			}
		})
	}

	getRandomUnits(numberToGive: number): Unit[] {
		const unitsToGive: Unit[] = []

		while (unitsToGive.length < numberToGive) {
			const randomIndex = Math.floor(Math.random() * this.units.length)
			const collection = this.units[randomIndex]
			unitsToGive.push(collection.unit)
			this.removeUnit(collection.unit.type)
		}

		return unitsToGive
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
