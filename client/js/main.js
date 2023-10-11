window.addEventListener('DOMContentLoaded', () => {
	relocateUnderNavbar()
})

function relocateUnderNavbar(spaceInPx = 16) {
	const navigationHeight = document.querySelector('nav')?.offsetHeight || null
	if (navigationHeight) {
		document.body.style.marginTop = `${ navigationHeight  + spaceInPx }px`
		document.body.style.minHeight = 'auto'
	}
	console.log(navigationHeight)
}