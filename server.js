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

app.get('/shorten/:shortcode',(req,res) => {
  const shortcode = req.params.shortcode;

  db.get(`SELECT * FROM urls WHERE short_code = ?`, 
    [shortcode], 
    function(err, row){
      if (err) {
        console.error(err);
        return;
      }

      if(!row){
        return res.status(404).json({
          "error": "Short URL not found"
        })
      }

      return res.status(200).json({
        "id": row.id,
        "url": row.url,
        "short_code": row.short_code,
        "created_at": row.created_at,
        "updated_at": row.updated_at
      })
    })
})

app.listen(port,() => console.log
(`Server is running on port ${port}`));


