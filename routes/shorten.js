const express = require("express");
const db = require("../database");
const generateShortCode = require("../utils/generateshortCode");

const router = express.Router();

router.post('/',(req,res) => {
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

router.get('/:shortcode',(req,res) => {
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





module.exports = router;