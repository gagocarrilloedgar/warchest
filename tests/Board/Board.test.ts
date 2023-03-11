import { Board } from "../../src/Board/Board"

describe("Board", () => {
	it("Should be able to create a new board", () => {
		const board = new Board(5)
		expect(board).toBeTruthy()
	})

	it("Should get a printable board", () => {
		const board = new Board(5)
		// const jestSpy = jest.spyOn(console, "log")
		const stringBoard = board.createDrawableBoard()

		const expectedBoard =
			"    0 1 2 3 4\n    ---------\n0 | . . . . .\n1 | . . @ @ .\n2 | . . . . .\n3 | . @ @ . .\n4 | . . . . ."

		expect(stringBoard).toEqual(expectedBoard)
	})
})
