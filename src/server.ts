import { Game } from "./context/Game"
import { GetPrintedUsers } from "./context/Users/application/GetUsers"

const init = async () => {
	const userToShow = new GetPrintedUsers()
	const users = await userToShow.execute()

	const game = new Game(users)
	await game.play()
}

init().catch((error) => console.log(error))
