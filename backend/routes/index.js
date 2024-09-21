// backend/routes/index.js
const express = require("express");
const router = express.Router();

//* Import this file into the routes/index.js file and connect it to the router there.
const apiRouter = require("./api");
router.use("/api", apiRouter);

//* Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

// ***** EXPORTS *****/

module.exports = router;
