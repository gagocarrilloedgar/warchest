import { Game } from "./Game/Game"

const game = new Game()
game.play().catch(() => console.error)
