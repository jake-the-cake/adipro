import { ServerConfig } from "../server/types"

function returnConnectionMessage({name, port}: ServerConfig) {
	name ? name = `${ name } server` : name = 'Server'
	return `${ name } connection established on port ${ port }.`
}

export {
  returnConnectionMessage
}