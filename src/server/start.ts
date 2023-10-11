import HTTP from "http"
import express from "express"
import cors from 'cors'
import CONFIG from "../config"
import { ServerConfig } from "./types"
import { createHtmlDoc } from "../controllers/html"
import routes from "../routes"

function expressServer(config: ServerConfig) {
	const app = express()
	app.use(cors())
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	app.use(express.static('client', {}))
	
	app.get('*', (req, _, next) => {
		console.log(req.url)
		next()
	})

	app.use('/auth', routes.AuthRouter)
	app.use('/api', routes.ApiRouter)
	app.use('/', routes.ClientRouter)

	app.route('*')
		.get(
			createHtmlDoc({
			template: 'nevergonnagiveyouup',
			app: 'nevergonnaletyoudown'
		}))
		.all((req, res) => { res.status(404).json({	message: `${ req.url } is an invalid endpoint.`, status: res.statusCode, ok: false })})
	return app
}

function startServer() {
	const config = CONFIG.server
	const server = HTTP.createServer(expressServer(config))
	server.listen(config.port, () => console.log(config.onConnect(config)))
}

export {
	startServer
}