import HTTP from "http"
import express from "express"
import cors from 'cors'
import CONFIG from "../config"
import {  ServerConfig } from "./types"
import { createHtmlDoc, useStaticPage } from "../controllers/html"
import { TestRouter } from "../routes"

function expressServer(config: ServerConfig) {
	const app = express()
	app.use(cors())
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	app.use(express.static('client', {}))
	
	app.get('*', (req, res, next) => {
		console.log(req.url)
		next()
	})

	app.use('/', TestRouter)

	app.get('/', createHtmlDoc({
		template: 'app',
		app: 'get-started/index',
		meta: {
			title: 'Get Started with Adipro\'s Health Quiz'
		}
	}))

	app.get('/get-started', useStaticPage('app/get-started'))
	
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