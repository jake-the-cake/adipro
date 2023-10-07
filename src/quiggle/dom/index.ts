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

export {
	QuiggleDom
}