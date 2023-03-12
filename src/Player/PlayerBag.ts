import { Unit, UnitFactory } from "../Unit/Unit"
import { UnitTypes } from "../Unit/UnitType"

export class PlayerBag {
	private readonly units: Unit[] = []
	private readonly MAX_UNITS_PER_TYPE

	private unitsCount = 0

	constructor(unitOptions: UnitTypes[], unitsPerType: number) {
		this.MAX_UNITS_PER_TYPE = unitsPerType
		this.initBag(unitOptions)
	}

	public initBag(options: UnitTypes[]): void {
		this.addUnit(UnitTypes.ROYAL)

		options.forEach((option: UnitTypes) => {
			for (let i = 0; i < this.MAX_UNITS_PER_TYPE; i++) {
				this.addUnit(option)
			}
		})

		this.unitsCount = this.units.length
	}

	getThreeRandomUnits(): Unit[] {
		const unitsToGive: Unit[] = []

		while (unitsToGive.length < 3) {
			const randomIndex = Math.floor(Math.random() * this.units.length)
			const unit = this.units[randomIndex]
			unitsToGive.push(unit)
			this.units.splice(randomIndex, 1)
		}

		this.unitsCount = this.units.length

		return unitsToGive
	}

	private addUnit(type: UnitTypes): void {
		const newUnit = UnitFactory.createUnit(type)
		this.units.push(newUnit)
	}
}
