import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js"
import noteRouter from "./routes/noteRoutes.js"
import autheticationRouter from './routes/authenticationRoutes.js'
import cors from 'cors'
import bodyParser from "body-parser"
import * as useragent from "express-useragent"
import path from 'path'

// The app.use() function adds a new middleware to the app. Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use() in order.
const app = express()
app.use(express.json())
app.use(cors())
console.log(process.cwd()) // current working directory
app.use(express.static(path.join(process.cwd(), 'FE')));

// express as framework
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")) // which middleware to use, middleware - function<->
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(useragent.express());

await connectDB()

// these are the required multiple services for things
// routing
// tell xprs, what function to do with what route - rec-res needed
app.get("/", (req, res) => {
    // open this file on FE, show it to client
    res.sendFile(path.resolve(path.join(process.cwd(), '/FE/index.html')));
})

app.get("/handle_user", (req, res) => {
    res.sendFile(path.resolve(path.join(process.cwd(), '/FE/handle_user.html')));
})

// two REST services
app.use("/api/auth", autheticationRouter)
app.use("/api/note", noteRouter)

const PORT = 3000

app.listen(PORT, () =>
    console.log(
        `Server is running in ${process.env.NODE_ENV} on port ${PORT}`
    )
)
