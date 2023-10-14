import { dbConnection } from "../database"
import { displayError } from "../error"
import { startServer } from "./start"

try {
  dbConnection(startServer)
}
catch(err: any) {
  displayError(err)
}