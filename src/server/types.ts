interface ServerConfig {
	port?: number | string
	name?: string
	onConnect: ({name, port}: ServerConfig) => string
}

export {
	ServerConfig
}