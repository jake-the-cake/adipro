interface ServerConfig {
	port?: number | string
	name?: string
	connectMessage: ({name, port}: ServerConfig) => string
}

export {
	ServerConfig
}