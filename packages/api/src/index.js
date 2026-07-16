const express = require("express");
const cardsRouter = require("./routes/cards");
const { connectDB } = require("./db/connect");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

//check endpoint
app.get("/health", (req,res) => {
    res.json({status: "ok", service: "wordsmith-api"});
});

app.use("/api/cards", cardsRouter);

async function start() {
await connectDB();
app.listen(PORT, () => {
    console.log('API listening on http://localhost:${PORT}');
});    
}

start();