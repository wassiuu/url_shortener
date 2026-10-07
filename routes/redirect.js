const express = require("express");
const db = require("../database.js");

const router = express.Router();


router.get("/:shortcode",(req,res) => {
  const shortcode = req.params.shortcode;

  db.get(`SELECT * FROM urls WHERE short_code = ?`,
    [shortcode],
    function(err,row){
      if(err){
        console.error(err);
        return res.status(500).json({
          "error": "Database error"
        })
      }

      if(!row){
        return res.status(404).json({
          "error": "Short URL not found"
        })
      }

      db.run(`UPDATE urls SET access_count = access_count +1
        WHERE short_code = ?`,
        [shortcode],
        function(err){
          if(err){
            console.error(err);
            return res.status(500).json({
              "error": "Database error"
            });
          }
            return res.redirect(row.url);
        })
    }
  )
})












module.exports = router;