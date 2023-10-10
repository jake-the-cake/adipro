import { ServerConfig } from "../server/types"
import dotenv from 'dotenv'
import { returnConnectionMessage } from "./messages"

dotenv.config()

interface Config {
	server: ServerConfig
	data: DataConfig
}

interface DataConfig {
	connect: string | null
}

const CONFIG: Config = {
	server: {
		port: process.env.PORT || 3000,
		name: 'Adipro Health',
		onConnect: returnConnectionMessage
	},
	data: {
		connect: process.env.MONGO_URI || null,
		// pages: '/client/page'
	}
}

export default CONFIG
export {
	Config
}