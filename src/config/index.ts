import { ServerConfig } from "../server/types"

interface Config {
	server: ServerConfig
	templates: TemplatesConfig
}

interface TemplatesConfig {
	dir: string
}

const CONFIG: Config = {
	server: {
		port: process.env.PORT || 3000,
		name: 'Adipro Health',
		connectMessage: ({name, port}) => `${ name ? name + ' server' : 'Server'} connection established on port ${ port }.`,
	},
	templates: {
		dir: '/assets'
	}
}

export default CONFIG
export {
	Config
}