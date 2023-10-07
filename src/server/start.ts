import HTTP from "http"
import express from "express"
import cors from 'cors'
import CONFIG from "../config"
import { ExpressFunction, ServerConfig } from "./types"
import { changeDirectory } from "./build"
import fs from 'fs'
import path from 'path'
import { HTMLDoc } from "../quiggle/ssr/types"
import QuiggleHtml from "../quiggle/ssr/html"

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

function useStaticPage(app: string, data?: any): ExpressFunction {
	return (req, res) => {
		if (app[0] === '/') app = app.slice(1)
		if (app.slice(app.length - 5) !== '.html') app += '/index.html'
		const file = path.join(changeDirectory(__dirname, 2), 'client', app)
		console.log(file)
		
		try {
			const htmlContent = fs.readFileSync(file, 'utf-8')

			res.setHeader('Content-Type', 'text/html')

			res.send(htmlContent)
		} catch (error) {
			console.error(error)
			res.status(500).send('Server error.')
		}
	}
}

function createHtmlDoc(doc: HTMLDoc): ExpressFunction {
	return (req, res) => {
		// const html = 
		new QuiggleHtml(doc, { req, res })
		// res.send('END')
	}
}

function startServer() {
	const config = CONFIG.server
	const server = HTTP.createServer(expressServer(config))
	server.listen(config.port, () => console.log(config.onConnect(config)))
}

export {
	startServer
}