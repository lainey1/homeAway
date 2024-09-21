// backend/routes/api/index.js

const router = require("express").Router();

//* Test the API Router
router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

// ***** EXPORTS *****/
module.exports = router;
