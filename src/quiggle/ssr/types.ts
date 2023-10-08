interface HTMLDoc {
	template: string
	page?: string
	app?: string
	meta?: {
			title?: string
		}
	data?: { [key: string]: any }
	error?: Error & {[key: string]: any}
}

export {
	HTMLDoc
}