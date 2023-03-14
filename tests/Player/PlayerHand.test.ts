import { PlayerHand } from "../../src/context/Player"
import { Unit, UnitType, UnitTypes } from "../../src/context/Unit"

describe("PlayerHand", () => {
	const units = [
		Unit.fromValue(UnitTypes.ARCHER),
		Unit.fromValue(UnitTypes.CAVALRY),
		Unit.fromValue(UnitTypes.ARCHER)
	]

	it("Should be able to create a new player hand", () => {
		const playerHand = new PlayerHand(units)
		expect(playerHand).toBeTruthy()
	})

	it("Shouldn't add more units if hand is full", () => {
		const playerHand = new PlayerHand(units) // 3 units
		const newUnit = Unit.fromValue(UnitTypes.ARCHER)
		playerHand.addUnit(newUnit)
		expect(playerHand.getUnitsCount()).toEqual(3)
	})

	it("Should be able to add a unit to the hand", () => {
		units.shift()
		const playerHand = new PlayerHand(units)
		const newUnit = Unit.fromValue(UnitTypes.ARCHER)
		playerHand.addUnit(newUnit)
		expect(playerHand.getUnitsCount()).toEqual(3)
	})

	it("Should be able to remove a unit from the hand", () => {
		const playerHand = new PlayerHand(units)
		const unitToRemove = UnitType.fromValue(UnitTypes.ARCHER)
		playerHand.removeUnit(unitToRemove)
		expect(playerHand.getUnitsCount()).toEqual(2)
	})
})
