const express = require("express");
const router = express.Router();

const { validateTask } =require("../validationMiddleware")
const { isOwner,isAdmin, isAuthenticated } = require("../authMiddleware");

const tasksController = require("../controllers/tasksController");

router.post("/create" ,isAuthenticated ,validateTask, tasksController.create);

router.patch("/update/:taskId" ,isAuthenticated ,isOwner,validateTask, tasksController.update);

router.delete("/delete/:taskId" ,isAuthenticated,isOwner, tasksController.delete);

router.get("/get/:taskId" ,isAuthenticated ,isOwner, tasksController.read);

router.get('/getall', isAuthenticated , tasksController.userReadAll)

// route for admin to view all tasks
router.get("/all" ,isAuthenticated ,isAdmin, tasksController.adminReadAll);

module.exports = router;
