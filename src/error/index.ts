function throwError(message: string, type?: ErrorConstructor) {
	const error = type ? new type(message) : new Error(message)
	displayError(error)
	throw error
}

function displayError(error: Error) {
	console.error(error.name, error.message)
	console.warn(error.stack)
}

const ERROR = {
	throwError,
	displayError
}

export {
	throwError,
	displayError
}

export default ERROR