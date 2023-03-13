import { Player } from "../Player/Player"
import { Unit } from "../Unit/Unit"

export interface Position {
	x: number
	y: number
}

export interface TableBoardPosition {
	value: string
	controlledBy: Player | null
	unit: Unit | null
}

export class Board {
	private readonly SIZE: number
	private readonly NEUTRAL_ZONE = "@"
	private readonly EMPTY_ZONE = "."
	private readonly SEPARATOR = " "
	private readonly VERTICAL_SEPARATOR = "|"
	private readonly HORIZONTAL_SEPARATOR = "-"

	private readonly NEUTRAL_ZONES = [
		{ x: 1, y: 1 },
		{ x: 1, y: 3 },
		{ x: 3, y: 3 },
		{ x: 3, y: 1 }
	]

	private readonly WOLF_ZONES = [{ x: 4, y: 2 }]
	private readonly CROWN_ZONES = [{ x: 0, y: 2 }]

	private readonly board: TableBoardPosition[][]

	constructor(size: number) {
		this.SIZE = size
		this.board = this.createBoard()
	}

	public createDrawableBoard(): string {
		const board = this.board.map((row, rowIndex) => {
			const newRow = row.map((column, columnIndex) => {
				const zone = this.isControlZone(this.NEUTRAL_ZONES, rowIndex, columnIndex)
					? this.NEUTRAL_ZONE
					: this.isControlZone(this.WOLF_ZONES, rowIndex, columnIndex)
					? "W"
					: this.isControlZone(this.CROWN_ZONES, rowIndex, columnIndex)
					? "C"
					: column.value

				return zone
			})

			return newRow.join(this.SEPARATOR)
		})

		const boardWithHorizontalSeparators = this.addHorizontalSeparator(board)
		const boardWithVerticalSeparators = this.addVerticalSeparator(boardWithHorizontalSeparators)

		return boardWithVerticalSeparators.join("\n")
	}

	public hashTagSeparator(playerName: string): string {
		return (
			new Array(5).fill(" # ").join("") +
			playerName.toUpperCase() +
			new Array(5).fill(" # ").join("")
		)
	}

	public placeUnitOnBoard(unit: Unit, position: Position, player: Player): void {
		if (!this.checkIfPositionIsInBoard({ x: position.x, y: position.y })) {
			throw new Error("Position is not in board")
		}

		this.board[position.x][position.y].value = unit.type.getAcronym()
		this.board[position.x][position.y].unit = unit
		this.board[position.x][position.y].controlledBy = player
	}

	public moveUnitOnBoard(unit: Unit, from: Position, to: Position, player: Player): void {
		if (!this.checkIfPositionIsInBoard({ x: from.x, y: from.y })) {
			throw new Error("Position is not in board")
		}

		console.log({ from, to })

		this.board[from.x][from.y].value = this.EMPTY_ZONE
		this.board[from.x][from.y].unit = null
		this.board[from.x][from.y].controlledBy = null

		// Check if is control zone and add player to control zone
		const isPotentialControlZone = this.isControlZone(this.NEUTRAL_ZONES, to.x, to.y)

		if (isPotentialControlZone) {
			const isWolf = player.playerInfo.name === "wolf"

			this.NEUTRAL_ZONES.splice(
				this.NEUTRAL_ZONES.findIndex((zone) => zone.x === to.x && zone.y === to.y),
				1
			)

			if (isWolf) {
				this.WOLF_ZONES.push({ x: to.x, y: to.y })
			} else {
				this.CROWN_ZONES.push({ x: to.x, y: to.y })
			}
		}

		this.placeUnitOnBoard(unit, to, player)
	}

	public addControlledZones(wolf: Player, crown: Player): void {
		this.board.forEach((row, rowIndex) => {
			row.forEach((_column, columnIndex) => {
				const zone = this.isControlZone(this.WOLF_ZONES, rowIndex, columnIndex)
					? wolf
					: this.isControlZone(this.CROWN_ZONES, rowIndex, columnIndex)
					? crown
					: null

				this.board[rowIndex][columnIndex].controlledBy = zone
			})
		})
	}

	public get getBoard(): TableBoardPosition[][] {
		return this.board
	}

	private createBoard(): { value: string; controlledBy: Player | null; unit: Unit | null }[][] {
		return Array.from({ length: this.SIZE }, () =>
			Array.from({ length: this.SIZE }, () => {
				return {
					value: this.EMPTY_ZONE,
					controlledBy: null,
					unit: null
				}
			})
		)
	}

	private addHorizontalSeparator(boardRows: string[]): string[] {
		const separators = new Array(this.SIZE).fill(this.HORIZONTAL_SEPARATOR).join("-")
		const indexes = Array(this.SIZE)
			.fill(this.HORIZONTAL_SEPARATOR)
			.map((_, index) => {
				return index.toString()
			})
			.join(this.SEPARATOR)

		return [indexes, separators, ...boardRows]
	}

	private addVerticalSeparator(boardRows: string[]): string[] {
		return boardRows.map((row, index) => {
			if (index === 0 || index === 1) {
				return `    ${row}`
			}

			return `${index - 2} ${this.VERTICAL_SEPARATOR} ${row}`
		})
	}

	private isControlZone(controlZones: Position[], row: number, col: number) {
		return controlZones.some((zone) => zone.x === row && zone.y === col)
	}

	private checkIfPositionIsInBoard(position: Position): boolean {
		return position.x >= 0 && position.x < this.SIZE && position.y >= 0 && position.y < this.SIZE
	}

	private checkIfPositionIsOrthogonalyAdjacentToAnyPlayerUnit(
		position: Position,
		player: Player
	): boolean {
		const playerUnits = player.playerInfo.name === "Wolf" ? this.WOLF_ZONES : this.CROWN_ZONES

		return playerUnits.some((playerUnit) => {
			const { x, y } = playerUnit

			return (
				(x === position.x && y === position.y + 1) ||
				(x === position.x && y === position.y - 1) ||
				(x === position.x + 1 && y === position.y) ||
				(x === position.x - 1 && y === position.y)
			)
		})
	}

	private checkIfPositionIsDiagonallyAdjacentToAnyPlayerUnit(
		position: Position,
		player: Player
	): boolean {
		const playerUnits = player.playerInfo.name === "Wolf" ? this.WOLF_ZONES : this.CROWN_ZONES

		return playerUnits.some((playerUnit) => {
			const { x, y } = playerUnit

			return (
				(x === position.x + 1 && y === position.y + 1) ||
				(x === position.x + 1 && y === position.y - 1) ||
				(x === position.x - 1 && y === position.y + 1) ||
				(x === position.x - 1 && y === position.y - 1)
			)
		})
	}
}
