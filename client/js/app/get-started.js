window.addEventListener('DOMContentLoaded', startApp)


// const pages = [
// 	{
// 		title: 'The Basics',
// 		blob: 'Testing',
// 		elements: [
// 			{
// 				type: 'input',
// 				label: 'Name',
// 				stack: 'h',
// 				name: 'name'
// 			},
// 			{
// 				type: 'row',
// 				elements: [
// 					{
// 						type: 'input',
// 						label: 'Zip Cope',
// 						stack: 'v',
// 						name: 'zip'
// 					},
// 					{
// 						type: 'input',
// 						label: 'Age',
// 						stack: 'v',
// 						name: 'age'
// 					}
// 				]
// 			}
// 		]
// 	}
// ]

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