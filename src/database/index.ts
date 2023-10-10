import mongoose from 'mongoose'
import CONFIG from '../config'
import { displayError, throwError } from '../error'

function dbConnection(serve: () => void) {
	new Promise((ok, fail) => {
		const data: string | null = CONFIG.data.connect || null
		if (!data) return fail(throwError('No connection uri provided.', SyntaxError))
		ok(data)
	})
	.then((uri) => {
		mongoose.connect(uri as string)
			.then(() => {
				console.log('Data Connection Established.')
				serve()
			})
			.catch((error) => displayError(error))
	})
	.catch((error) => displayError(error))
}

export {
	dbConnection
}