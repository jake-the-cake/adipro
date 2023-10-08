window.addEventListener('DOMContentLoaded', startApp)

const form = new QuiggleMultiPageForm('get-started-app')

function startApp() {
	const app = document.getElementById('get-started-app')
	if (!app) return console.error(new Error('Application not found.'))
	const [...titles] = Array.from(document.getElementById('form-header')?.children ?? [])
	if (titles.length < 1) return console.error(new Error('No form titles found'))
	titles.forEach((title, i) => {
		title.id = `form-page-${ i + 1 }-title`
	})

	form.changeActiveElement('hide-left', 'title')
}