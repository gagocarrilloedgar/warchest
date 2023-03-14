import { PlayerBag } from "../../src/context/Player"
import { UnitType, UnitTypes } from "../../src/context/Unit"

describe("PlayerBag", () => {
	const unitsPerType = 2
	const unitOptions = [UnitTypes.ARCHER, UnitTypes.CAVALRY]

	it("Should be able to create a new player bag", () => {
		const playerBag = new PlayerBag(unitOptions, unitsPerType)
		expect(playerBag).toBeTruthy()
	})

	it("Should generate the correct number of units when the bag is created", () => {
		const playerBag = new PlayerBag(unitOptions, unitsPerType)
		const totalCount = unitOptions.length * unitsPerType + 1
		const units = playerBag.getUnitsCount()

		expect(units).toEqual(totalCount)
	})

	it("should be able to add a unit", () => {
		const playerBag = new PlayerBag(unitOptions, unitsPerType) // 5 units
		const newUnit = new UnitType(UnitTypes.ARCHER) // 1 unit
		playerBag.addUnit(newUnit) // 6 units
		const totalCount = 4 + 1 + 1

		expect(playerBag.getUnitsCount()).toEqual(totalCount)
	})

	it("should be able to remove a unit", () => {
		const playerBag = new PlayerBag(unitOptions, unitsPerType) // 5 units
		const newUnit = new UnitType(UnitTypes.ARCHER) // 1 unit
		playerBag.removeUnit(newUnit) // 4 units
		const totalCount = 4

		expect(playerBag.getUnitsCount()).toEqual(totalCount)
	})

	it("Should remove the units from the bag after giving them to the player", () => {
		const bag = new PlayerBag(unitOptions, unitsPerType) // 5 units

		const units = bag.getRandomUnits(1)
		const totalCount = 4
		const unitsCount = bag.getUnitsCount()

		expect(units.length).toEqual(1)
		expect(unitsCount).toEqual(totalCount)
	})
})
