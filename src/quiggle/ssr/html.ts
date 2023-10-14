import { changeDirectory } from "../utils"
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
		if (!this.api.res.headersSent) this.renderHtmlDoc()
	}

	static pattern = new RegExp('{![\\s\\S]*?!}', 'g')

	static errorCodes: {[key: string]: Error} = {
		['400']: new Error('Oops! The server received an invalid request. To proceed, please double-check that all required properties are included.'),
		['401']: new Error('Uh-oh! Looks like you need a special key to unlock this door. You\'re unauthorized at the moment. Please provide the correct credentials to access this area.'),
		['403']: new Error('Whoops! The gates are closed, and you\'re not on the guest list. You don\'t have permission to enter this area. Please seek clearance from the powers that be.'),
		['404']: new Error('Well, this is awkward! The page you\'re searching for seems to have taken a vacation. It\'s gone missing. Try checking the URL or navigate back to a known path.'),
		['500']: new Error('Oopsie-daisy! Something went wrong behind the scenes, and our server is having a little hiccup. Don\'t worry; our tech wizards are already on it. Please try again later.')
	}

	static getHtmlDoc(type: string, name: string) {
		try {	return fs.readFileSync([changeDirectory(__dirname, 3), 'client', type, name + '.html'].join('/')).toString() }
		catch (error) {	return undefined }
	}

	climbDownObjectTree(obj: any, props: string[]) {
		props.forEach((prop: string) => {
			if (obj && obj[prop]) obj = obj[prop]
		})
		return obj
	}

	returnErrorPage(status: number) {
		this.template = QuiggleHtml.getHtmlDoc('template', 'error')!
		this.replacePlaceholders((instance: string) => {
			let [_, ...props]: any[] = this.removeDecoration(instance).split('.')
			if (props.length === 0) return this.updateHtml(instance, 'Uh oh')
			let obj: any = QuiggleHtml.errorCodes[String(status)]
			obj.stack = obj.stack.replace(obj.name + ': ' + obj.message, '').trim()
			obj.status = status
			obj = this.climbDownObjectTree(obj, props)
			props.forEach((prop: string) => {
				if (obj && obj[prop]) obj = obj[prop]
			})
			this.updateHtml(instance, obj || instance)
		})
		return this.template
	}

	useErrorPage(status?: string | number) {
		if (!status || /^[0-9]g/.test(status as string)) status = 500
		return this.returnErrorPage(Number(status))
	}


	updateHtml(remove: string, add: string): void {
		if (!add) return
		this.template = this.template!.replace(remove, add)
	}

	getComponents() {
		if (!this.doc.template) return this.api?.res.send(this.useErrorPage('400'))
		this.template = QuiggleHtml.getHtmlDoc('template', this.doc.template)
		if (!this.template) return this.api?.res.send(this.useErrorPage(404))
		const content = {
			page: QuiggleHtml.getHtmlDoc('page', this.doc.page!),
			app: QuiggleHtml.getHtmlDoc('app', this.doc.app!),
			default: 'No content to display.'
		}
		this.content = (() => {
			if (content.page) return content.page
			if (content.app) return content.app
			return content.default
		})()
	}

	removeDecoration(value: string) {
		return value.replace('{!', '').replace('!}', '').trim()
	}

	replacePlaceholders(callback: (instance: string) => void) {
		const instances = this.template!.match(QuiggleHtml.pattern) || []
		instances.forEach((instance: string) => callback(instance))
	}
	
	replacePageTitle() {
		this.replacePlaceholders((instance: string) => {
			const selectors: string[] = ['title', 'meta.title']
			if (selectors.includes(this.removeDecoration(instance))) {
				this.updateHtml(instance, this.doc.meta?.title ?? 'Title is missing.')
			}
		})
	}

	replaceContent() {
		this.replacePlaceholders((instance: string) => {
			if (this.removeDecoration(instance) === 'content') this.updateHtml(instance, this?.content ?? 'Nothing')
		})
	}

	renderHtmlDoc() {
		if(!this.template) return this.useErrorPage(500)
		this.replacePageTitle()
		this.replaceContent()
		this.replacePlaceholders((instance: string) => {
			const keywordPattern = /^[A-Za-z]+$/
			const selectorPattern = /^[A-Za-z/]+$/
			const undecoratedInstance = this.removeDecoration(instance)
			const variableTree = undecoratedInstance.split('.').length > 1 ? undecoratedInstance.split('.') : null
			let selectorEntry = undecoratedInstance.split(':').length === 2 ? undecoratedInstance.split(':') : null
			const keyword = keywordPattern.test(undecoratedInstance) ? undecoratedInstance : null
			let injectionValue: string = ''
			if (variableTree) injectionValue = this.climbDownObjectTree(this.doc, variableTree.slice(1))
			if (selectorEntry) {
				const [key, value] = [selectorEntry[0].trim(), selectorEntry[1].trim()]
				if (!keywordPattern.test(key) || !selectorPattern.test(value)) {
					injectionValue = 'Syntax Error'
				}
				else {
					injectionValue = QuiggleHtml.getHtmlDoc('component', value) || 'No content found.'
				}
			}
			if (keyword) {
				injectionValue = keyword
			}
			this.updateHtml(instance, injectionValue )
		})
		return this.api?.res.send(this.template)
	}
}

export default QuiggleHtml