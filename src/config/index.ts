import { ServerConfig } from "../server/types"
import dotenv from 'dotenv'
import { returnConnectionMessage } from "./messages"

dotenv.config()

interface Config {
	server: ServerConfig
	www: WwwConfig
}

interface WwwConfig {
	templates: string
	pages: string
}

const CONFIG: Config = {
	server: {
		port: process.env.PORT || 3000,
		name: 'Adipro Health',
		onConnect: returnConnectionMessage
	},
	www: {
		templates: '/assets/templates',
		pages: '/assets/pages'
	}
}

export default CONFIG
export {
	Config
}