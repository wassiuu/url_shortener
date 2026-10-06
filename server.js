const express = require("express");
const shortenRouter = require("./routes/shorten");

const app = express();
app.use(express.json());
const port = 3000;

app.use("/shorten", shortenRouter);




app.listen(port,() => console.log
(`Server is running on port ${port}`));


