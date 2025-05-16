const router = require("express").Router();
const authRoutes = require("./routes/api/AuthRoute");
const createError = require("http-errors");
router.use("/auth", authRoutes);
 router.use("/", (req, res, next) => {
   next(
    createError.NotFound("The route you are trying to access does not exist.")
  );
});
 router.use((error, req, res, next) => {
   res.status(error.status || 500);

   return res.json({
     error: {
       status: error.status || 500,
       message: error.message || "Internal Server Error",
     },
   });
 });

module.exports = router;