require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/index.js");
const { syncDatabase } = require("./models/index.js");
const ErrorHandler = require("./middleware/errorHandlerMiddleware.js");
const http = require("http");
const initSocket = require("./utility/socket.js");

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use("/api", router);

app.use(ErrorHandler);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Success" });
});

initSocket(server);

const start = async () => {
    try {
        await syncDatabase();
        app.listen(PORT, () => {
            console.info(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.error("Error to start server!" + "\n-----------------\n" + e);
    }
};

start();
