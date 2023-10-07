window.addEventListener('DOMContentLoaded', startApp)

const utils = {
	parseAllInts: (value: string): number => Number(value.match(/[0-9]/g)?.join('')) || 0
}

const config = {
	currentPage: 1,
	title: (index: number) => `form-page-${ index + 1 }-title`
}

class QuiggleMultiPageForm {
	container: Element | null
	forms: Element[]
	titleElements: Element[]
	titleContent: Element[] = []

	constructor(id: string) {
		this.container = document.getElementById(id)!
		this.titleElements = Array.from(document.getElementById('form-header')!.children)
		this.titleElements.forEach((element: Element) => {
			this.titleContent.push(element.firstElementChild!)
		})
		this.forms = Array.from(document.getElementById('form-display')!.children)
		this.forms.forEach((form: Element) => {
			form.querySelector('button')!.onpointerup = (e: PointerEvent) => {
				e.preventDefault()
				config.currentPage++
				this.changeActiveElement(QuiggleMultiPageForm.classes.hideTitle)
			}
		})
		console.log(this)
	}

	static classes = {
		hideTitle: 'form-title__hidden'
	}

	changeActiveElement(className: string) {
		// const makeActive = this.titleContent[config.currentPage - 1]
		const makeActive = document.getElementById(`form-page-${ config.currentPage }-title`)?.firstElementChild
		console.log(makeActive!.parentNode)
		// if (typeof makeActive === 'number' || Number(makeActive) * 0 === 0) makeActive = this.titleElements[makeActive as number - 1]
		// if (typeof makeActive === 'string') {
			// makeActive = document.getElementById(makeActive)!
			// if (!makeActive) return console.warn(new Error('cannot locate id: ' + makeActive))
		// }
		// config.currentPage = utils.parseAllInts(makeActive.id)
		this.titleContent.filter(element => utils.parseAllInts(element.id) !== config.currentPage).forEach((element: Element) => {
			console.log(element)
			QuiggleDom.addClass(element, className)
		})
		console.log(this.titleContent)
		QuiggleDom.removeClass(makeActive, className)
	}
}

interface IGquiggleDom {
	app: Element
}

class QuiggleDom implements IGquiggleDom {
	app: Element

	constructor(app: Element) {
		this.app = app
	}

	static addClass(element: Element, name: string) {
		element.classList.add(name)
	}

	static removeClass(element: Element, name: string) {
		element.classList.remove(name)
	}	
	
	static toggleClass(element: Element, name: string) {
		element.classList.toggle(name)
	}
}

const quiggleMPF = new QuiggleMultiPageForm('get-started-app')

function startApp() {
	const app = document.getElementById('get-started-app')
	if (!app) return console.error(new Error('Application not found.'))
	const [...titles] = Array.from(document.getElementById('form-header')?.children ?? [])
	if (titles.length < 1) return console.error(new Error('No form titles found'))
	titles.forEach((title: Element, i: number) => {
		title.id = config.title(i)
	})
	quiggleMPF.changeActiveElement('form-app__hidden')
}