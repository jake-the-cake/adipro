const utils = {
	parseAllInts: (value) => Number(value.match(/[0-9]/g)?.join('')) || 0,
	useAsString: (value) => { 
		if (!value) value = ''
		return value
	},
	usePath: (href) => { if (!href || href[0] !== '/') return '/' + utils.useAsString(href)}
}

class QuiggleDom {

	constructor(app) {
		this.app = app
	}

	static useLink(href) {
		window.location.href = utils.usePath(href)
	}

	static addClass(element, name) {
		element.classList.add(name)
	}

	static removeClass(element, name) {
		element.classList.remove(name)
	}	
	
	static toggleClass(element, name) {
		element.classList.toggle(name)
	}
}

class QuiggleForm {
	basicTextInput(options) {
		const input = document.createElement('input')
		input.type = 'text'
		if (options) Object.entries(options).forEach(([key, value]) => input[key] = value)
		return input
	}
}


class QuiggleMultiPageForm {
	constructor(id, { classes, pages } = {}) {
		this.currentPage = 1
		this.titleContent = []
		this.container = document.getElementById(id)
		this.titleElements = Array.from(document.getElementById('form-header').children)
		this.titleElements.forEach((element) => {
			this.titleContent.push(element.firstElementChild)
		})

		this.forms = Array.from(document.getElementById('form-display').children)
		this.forms.forEach((form) => {
			form.querySelector('button').onpointerup = (e) => {
				e.preventDefault()
				this.currentPage++
				this.changeActiveElement(this.useClass().hideTitle)
			}
		})
		if (classes) this.classes = classes
	}
	
	static classes = {
		hideTitle: 'hide-left'
	}

	useClass() {
		return this?.classes ?? QuiggleMultiPageForm.classes
	}
	
	changeActiveElement(className, property) {
		const page = `form-page-${ this.currentPage }-${ property }`
		const activeElement = document.getElementById(page).firstElementChild
		this.titleContent.forEach((element) => {
			if (!element.classList.contains(className)) QuiggleDom.addClass(element, className)
		})
		QuiggleDom.removeClass(activeElement, className)
	}
}