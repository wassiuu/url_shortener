const express = require("express");
const db = require("./database");
const generateShortCode = require("./utils");
const app = express();
app.use(express.json());
const port = 3000;

app.get('/hello',(req,res) => {
  res.send('Hello World');
});

app.get('/test',(req,res) => {
  res.json(
    {
      "message": "My API works",
      "success": true
    }
  )  
});

app.post('/shorten',(req,res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({
      "error": "URL is required"
    })
  }

  const shortCode = generateShortCode();
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO urls (url, short_code, created_at, updated_at) 
    VALUES (?, ?, ?, ?)
    `, [url, shortCode, now, now],

    function(err) {
      if (err) {
        console.error(err);
        return;
      }

    console.log("Inserted row:", this.lastID);

    res.status(201).json({
      "id": this.lastID,
      "url": url,
      "short_code": shortCode,
      "created_at": now,
      "updated_at": now
    })
    }
  )

});

app.listen(port,() => console.log
(`Server is running on port ${port}`));


