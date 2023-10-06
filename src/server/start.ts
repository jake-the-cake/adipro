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

	// app.get('/', createHtmlDoc({ page: 'test'}))
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

	static errorCodes: {[key: string]: Error} = {
		['400']: new Error('Oops! The server received an invalid request. To proceed, please double-check that all required properties are included.'),
		['401']: new Error('Uh-oh! Looks like you need a special key to unlock this door. You\'re unauthorized at the moment. Please provide the correct credentials to access this area.'),
		['403']: new Error('Whoops! The gates are closed, and you\'re not on the guest list. You don\'t have permission to enter this area. Please seek clearance from the powers that be.'),
		['404']: new Error('Well, this is awkward! The page you\'re searching for seems to have taken a vacation. It\'s gone missing. Try checking the URL or navigate back to a known path.'),
		['500']: new Error('Oopsie-daisy! Something went wrong behind the scenes, and our server is having a little hiccup. Don\'t worry; our tech wizards are already on it. Please try again later.')
	}

	static returnErrorPage(status: number) {
		let html: string = QuiggleHtml.getHtmlDoc('template', 'error')
		const variables: string[] = []
		html.split('${').forEach((item: string) => {
			if (item.split('}').length <= 1) return
			variables.push(item.split('}')[0].trim())
		})
		variables.forEach((variable: string) => {
			let obj: any = QuiggleHtml.errorCodes[String(status)]
			obj.stack = obj.stack.replace(obj.name + ': ' + obj.message, '').trim()
			obj.status = status
			
			variable.split('.').forEach((item: string) => {
				if (obj[item]) obj = obj[item]
			})
			html = html.replace('${ ' + variable + ' }', obj || 'Nope')
		})
		return html
	}

	static useErrorPage(status?: string | number) {

		if (!status || /^[0-9]g/.test(status as string)) {
			status = 500
		}
		return QuiggleHtml.returnErrorPage(Number(status))
	}

	static getHtmlDoc(type: string, name: string) {
		return fs.readFileSync([changeDirectory(__dirname, 2), 'client', type, name + '.html'].join('/')).toString()
	}

	getComponents() {
		if (!this.doc.template) return this.api?.res.send(QuiggleHtml.useErrorPage('400'))
		// if (!this.doc.template) return this.api?.res.send(QuiggleHtml.useErrorPage(400))
		

		
		
		return this.api?.res.send('To be continued...')
	}
}


// function initHtmlDocObject(document: HTMLDoc): (HTMLDoc & HTMLInfo) | void {
// 	if (!document.template) return console.log('ERROR! No template provided.')
// 	const template = changeDirectory(__dirname, 2) + CONFIG.www.templates + '/' + document.template + '.html'
// 	if (!document.page) return console.log('ERROR! No page provided.')
// 	const page = changeDirectory(__dirname, 2) + CONFIG.www.pages + '/' + document.page + '.html'
// 	return {
// 		template,
// 		page,
// 		htmlContent: ''
// 	}
// }

function startServer() {
	const config = CONFIG.server
	const server = HTTP.createServer(expressServer(config))
	server.listen(config.port, () => console.log(config.onConnect(config)))
}

export {
	startServer
}