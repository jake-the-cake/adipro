import HTTP from "http"
import express, { NextFunction, Request, Response } from "express"
import cors from 'cors'
import CONFIG from "../config"
import { ServerConfig } from "./types"
import { changeDirectory } from "./build"
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

	app.get('/', createHtmlDoc({ template: 'index', page: 'test'}))

	app.get('/get-started', useStaticPage('app/get-started'))
	
	return app
}







type ExpressFunction = (req: Request, res: Response, next?: NextFunction) => void

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





interface HTMLDoc {
	template: string
	page?: string
	app?: string
	meta?: {
			title?: string
		}
	data?: { [key: string]: any }
}

interface HTMLInfo {
	htmlContent?: string
}

type THtmlDoc = HTMLDoc & HTMLInfo

interface ExpressApiObjects {
	req: Request
	res: Response
	next?: NextFunction
}



function createHtmlDoc(doc: HTMLDoc): ExpressFunction {
	return (req, res) => {
		const html = new QuiggleHtml(doc, { req, res })
		// res.send('END')
	}
}

class QuiggleHtml {
	doc: HTMLDoc
	api?: ExpressApiObjects
	template?: string
	page?: string
	app?: string

	constructor(doc: HTMLDoc, api: ExpressApiObjects) {
		this.doc = doc
		this.api = api
		this.getComponents()
	}

	static useErrorPage(options?: any) {
		function returnErrorPage() {
			let html: string = QuiggleHtml.getHtmlDoc('template', 'error')
			const variables: string[] = []
			html.split('${').forEach((item: string) => {
				if (item.split('}').length <= 1) return
				variables.push(item.split('}')[0].trim())
			})
			variables.forEach((variable: string) => {
				let obj: any = {...options}
				variable.split('.').forEach((item: string) => {
					if (obj[item]) obj = obj[item]
				})
				html = html.replace('${ ' + variable + ' }', obj || 'Nope')
			})
			return html
		}

		switch (options.error.status) {
			case 400:
				return returnErrorPage()
			default:
				return 'IDK what happened, man!'
		}
	}

	static getHtmlDoc(type: string, name: string) {
		return fs.readFileSync([changeDirectory(__dirname, 2), 'client', type, name + '.html'].join('/')).toString()
	}

	getComponents() {
		if (!this.doc.template) return this.api?.res.send(QuiggleHtml.useErrorPage({error: { status: 400 }}))
		return this.api?.res.send('To be continued...')
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