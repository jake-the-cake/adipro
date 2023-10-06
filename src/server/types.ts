import { NextFunction, Request, Response } from "express"

interface ServerConfig {
	port?: number | string
	name?: string
	onConnect: ({name, port}: ServerConfig) => string
}

type ExpressFunction = (req: Request, res: Response, next?: NextFunction) => void

interface ExpressApiObjects {
	req: Request
	res: Response
	next?: NextFunction
}


export {
	ServerConfig,
	ExpressFunction,
	ExpressApiObjects,
}