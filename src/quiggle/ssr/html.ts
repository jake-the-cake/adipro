import { changeDirectory } from "../../server/build"
import { ExpressApiObjects } from "../../server/types"
import { HTMLDoc } from "./types"
import fs from 'fs'

class QuiggleHtml {
	doc: HTMLDoc
	api?: ExpressApiObjects
	template?: string
	content?: string

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
		let html: string = QuiggleHtml.getHtmlDoc('template', 'error')!
		const variables: string[] = []
		console.log(html)
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
		try {
			const file = fs.readFileSync([changeDirectory(__dirname, 3), 'client', type, name + '.html'].join('/')).toString()
			console.log(file)
			return file
		}
		catch (error) {
			return undefined
		}
	}

	getComponents() {
		if (!this.doc.template) return this.api?.res.send(QuiggleHtml.useErrorPage('400'))
		this.template = QuiggleHtml.getHtmlDoc('template', this.doc.template)
		if (!this.template) return this.api?.res.send(QuiggleHtml.useErrorPage(404))
		if (!this.doc.page && !this.doc.app) return this.api?.res.send(this.template.replace('${ content }', 'No content provided'))
		this.content = QuiggleHtml.getHtmlDoc(this.doc.page ? 'page' : 'app', this.doc.page ? this.doc.page : this.doc.app!)
		this.template = this.template.replace('${ title }', this.doc.meta?.title ?? 'Title')
		return this.api?.res.send(this.template.replace('${ content }', this.content || 'Nothing'))
	}
}

export default QuiggleHtml