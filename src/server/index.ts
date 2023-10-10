import { dbConnection } from "../database"
import { startServer } from "./start"

dbConnection(startServer)