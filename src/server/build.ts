import CONFIG from "../config"
import fs from 'fs'

class Template {
	base: string
	// dir: string
	html: string
	doc?: Document

	constructor() {
		this.base = __dirname.replace('/dist/server', CONFIG.templates.dir)
		// this.dir = CONFIG.templates.dir
		this.html = ''
	}

	getTemplate(template: string) {
		if (template[0] !== '/') template = '/' + template
		return fs.createReadStream(this.base + template)
	}

	getContent(page: string, data: any) {
		if (page[0] !== '/') page = '/' + page
		return fs.createReadStream(this.base + '/pages' + page)
	}
}

export {
	Template
}