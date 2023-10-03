import HTTP from "http"
import express, { NextFunction, Request, Response } from "express"
import cors from 'cors'
import CONFIG from "../config"
import { ServerConfig } from "./types"
import { Template, changeDirectory } from "./build"
import fs from 'fs'
import path from 'path'






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

	app.get('/', createHtmlDoc({template: 'index', page: 'test'}))

	app.get('/get-started', useStaticPage('app/get-started'))
	
	return app
}







type ExpressFunction = (req: Request, res: Response, next?: NextFunction) => void

function useStaticPage(app: string, data?: any): ExpressFunction {
	return (req, res) => {
		if (app[0] === '/') app = app.slice(1)
		if (app.slice(app.length - 5) !== '.html') app += '/index.html'
		const file = path.join(changeDirectory(__dirname, 2), 'client', app)
		// const
		console.log(file)
		
		try {
			const htmlContent = fs.readFileSync(file, 'utf-8')

			res.setHeader('Content-Type', 'text/html')

			res.send(htmlContent)
		} catch (error) {
			console.error(error)
			res.status(500).send('Server error.')
		}

		// const contentType = {
    //     '.html': 'text/html',
    //     '.css': 'text/css',
    //     '.js': 'text/javascript',
    // }
		
	}
}





interface HTMLDoc {
	template: string
	page: string
}

interface HTMLInfo {
	htmlContent?: string
}

type THtmlDoc = HTMLDoc & HTMLInfo

function createHtmlDoc(document: HTMLDoc, data?: unknown): ExpressFunction {
	return (req, res) => {
		const info: THtmlDoc | void = initHtmlDocObject(document)
		if (!info) return res.send('OOPS!')
		fs.access(info.template, fs.constants.F_OK, (error) => {
			if (!error) {
				return fs.readFile(info.template, (error, data) => {
					if (!error) {
						console.log(data)
							return fs.access(info.page, fs.constants.F_OK, (error) => {
								if (!error) {
									return fs.readFile(info.page, (error, data) => {
										if (!error) {
											console.log(data)
											
											return res.status(200).end(data)
										}
										return res.status(500).send('Server error.')
									})
								}
								return res.status(404).send('Can\'t find page.')
							})
						// return res.status(200).end(data)
					}
					return res.status(500).send('Server error.')
				})
			}
			return res.status(404).send('Can\'t find template.')
		})
	}
}

function initHtmlDocObject(document: HTMLDoc): (HTMLDoc & HTMLInfo) | void {
	if (!document.template) return console.log('ERROR! No template provided.')
	const template = changeDirectory(__dirname, 2) + CONFIG.www.templates + '/' + document.template + '.html'
	if (!document.page) return console.log('ERROR! No page provided.')
	const page = changeDirectory(__dirname, 2) + CONFIG.www.pages + '/' + document.page + '.html'
	return {
		template,
		page,
		htmlContent: ''
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