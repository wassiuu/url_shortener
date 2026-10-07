const express = require("express");
const shortenRouter = require("./routes/shorten");
const redirectRouter = require("./routes/redirect");

const app = express();
app.use(express.json());
const port = 3000;

app.use("/shorten", shortenRouter);
app.use("/",redirectRouter);




app.listen(port,() => console.log
(`Server is running on port ${port}`));


