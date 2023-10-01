import CONFIG from "../config"
import fs from 'fs'

class Template {
	base: string
	html: string
	// doc?: Document

	constructor() {
		this.base = changeDirectory(__dirname, 2)
		this.html = ''
	}
	
	getTemplate(template: string) {
		this.base = changeDirectory(this.base, CONFIG.www.templates)
		if (template[0] !== '/') template = '/' + template
		return fs.createReadStream(this.base + template)
	}

	getContent(page: string, data: any) {
		this.base = changeDirectory(this.base, CONFIG.www.pages)
		if (page[0] !== '/') page = '/' + page
		return fs.createReadStream(this.base + page)
	}
}

function changeDirectory(path: string, value: string | number): string {
	if (typeof value === 'number') {
		const arr = path.split('/')
		for (let i = 0; i < value; i++) {
			arr.pop()
		}
		path = arr.join('/')
	}
	if (typeof value === 'string') path = path + value
	return path
}

export {
	Template,
	changeDirectory
}