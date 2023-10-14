import QuiggleHtml from "../quiggle/ssr/html"
import { HTMLDoc } from "../quiggle/ssr/types"
import { changeDirectory } from "../quiggle/utils"
import { ExpressFunction } from "../server/types"
import fs from 'fs'
import path from 'path'


function useStaticPage(app: string, data?: any): ExpressFunction {
	return (req, res) => {
		if (app[0] === '/') app = app.slice(1)
		if (app.slice(app.length - 5) !== '.html') app += '/index.html'
		const file = path.join(changeDirectory(__dirname, 2), 'client', app)
		console.log(file)
		
		try {
			const htmlContent = fs.readFileSync(file, 'utf-8')

			res.setHeader('Content-Type', 'text/html')

			res.send(htmlContent)
		} catch (error) {
			console.error(error)
			res.status(500).send('Server error.')
		}
	}
}

function createHtmlDoc(doc: HTMLDoc): ExpressFunction {
	return (req, res) => {
		new QuiggleHtml(doc, { req, res })
		// res.send('END')
	}
}

export {
	createHtmlDoc,
	useStaticPage
}