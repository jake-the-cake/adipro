import { Router } from "express"
import { ClientRouter } from "./client"
import { ApiRouter } from "./api"
import { AuthRouter } from "./auth"


const router = Router()
const routes = {
	ClientRouter,
	ApiRouter,
	AuthRouter
}

export default routes