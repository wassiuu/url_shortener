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

  try {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error();
  }
} catch {
  return res.status(400).json({
    error: "Invalid URL"
  });
}

  const shortCode = generateShortCode();
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO urls (url, short_code, created_at, updated_at) 
    VALUES (?, ?, ?, ?)
    `, [url, shortCode, now, now],

    function(err) {
      if (err) {;
        return res.status(500).json({
          "error": "Database error"
        })
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
        return res.status(500).json({
          "error": "Database error"
        })
      }

      if(!row){
        return res.status(404).json({
          "error": "Short URL not found"
        })
      }

      db.run(
        `UPDATE urls
        SET access_count = access_count + 1
        WHERE short_code = ?`,
        [shortcode],
        function(err){
          if(err){
            return res.status(500).json({
              "error": "Database error"
            });
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
})

router.put('/:shortcode',(req,res) => {
  const shortcode = req.params.shortcode;
  const newUrl = req.body.url;

  if(!newUrl){
    return res.status(400).json({
      "error": "URL is required"
    })
  }
  try {
  const parsedUrl = new URL(newUrl);

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error();
  }
} catch {
  return res.status(400).json({
    error: "Invalid URL"
  });
}

  const now = new Date().toISOString();

  db.run(
    `UPDATE urls
    SET url = ?, updated_at = ?
    WHERE short_code = ?`,
    [newUrl, now, shortcode],
    function(err){

      if(err){
        return res.status(500).json({
          "error": "Database error"
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          "error": "Short URL not found"
        })
      }

      db.get(`
        SELECT * FROM urls WHERE short_code = ?`,
        [shortcode],
        function(err, row){
          if(err){
            return res.status(500).json({
              "error": "Database error"
            });
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
})

router.delete('/:shortcode',(req,res) => {
  const shortcode = req.params.shortcode;

  db.run(
    `DELETE FROM urls WHERE short_code = ?`,
    [shortcode],

    function(err){
      if(err){
        return res.status(500).json({
          "error": "Database error"
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          "error": "Short URL not found"
        })
      }

      return res.status(204).send()
    }
  )
})

router.get('/:shortcode/stats',(req,res) => {
  const shortcode = req.params.shortcode;

  db.get(`SELECT * FROM urls WHERE short_code = ?`,
    [shortcode],
    function(err,row){
      if(err){
          return res.status(500).json({
          "error": "Database error"
        });
      }

      if(!row){
        return res.status(404).json({
          "error": "Short URL not found"
        })
      }

      return res.status(200).json({
        "id": row.id, 
        "url": row.url,
        "shortCode": row.short_code,
        "createdAt": row.created_at,
        "updatedAt": row.updated_at,
        "accessCount": row.access_count
      })
    }
  )
})

module.exports = router;