import { Game } from "./context/Game"

const game = new Game()
game.play().catch(console.error)
