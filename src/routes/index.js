import express from "express";
import LessonRoute from "./lesson.route.js";
import BookRoute from "./books.route.js";

const router = express();
router.get("/", function (req, res, next) {
  res.status(200).send({
    title: "Node Express API",
    version: "0.0.2",
  });
});

router.use("/api/lesson", LessonRoute);
router.use("/api/book", BookRoute);

export default router;