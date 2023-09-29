import HTTP from "http"
import express from "express"
import cors from 'cors'
import CONFIG from "../config"
import { ServerConfig } from "./types"
import { Template } from "./build"

function expressServer(config: ServerConfig) {
	const app = express()
	app.use(cors())
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	app.get('/', async (req, res) => {
		useTemplate('index', 'test', res, {})
	})
	
	return app
}

function useTemplate(template: string, page: string, res: any, data: any) {
	const info: any = {
		template: new Template().getTemplate(template + '.html'),
		page: new Template().getContent(page + '.html', {}),
		html: '',
	}
	
	info.template.on('data', (chunk: any) => {
		info.html += chunk.toString()
	})
	info.template.on('end', () => {
		let page: string = ''
		info.page.on('data', (chunk: any) => {
			page += chunk.toString()
		})
		info.page.on('end', () => {
			info.html = info.html.replace('\n', '').replace('<div id="root"></div>', page)
			res.send(info.html)
		})
	})
}

function startServer() {
	const config = CONFIG.server
	const server = HTTP.createServer(expressServer(config))
	server.listen(config.port, () => console.log(config.connectMessage(config)))
}

export {
	startServer
}