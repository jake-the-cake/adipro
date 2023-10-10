import { Router } from "express"

const router = Router()

router.get('/gotcha', (req, res) => {
	res.send('gotcha')
})

export {
	router as TestRouter
}