const Task = require("../models/task");

module.exports.create = async (req, res, next) => {
  try {
    const { id: userId, username } = req.user;
    const { title, description } = req.body;
    await Task.create({
      title,
      description,
      userId,
      username,
    });
    return res.status(200).json({ message: "Task created successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;
    await Task.update(
      {
        title,
        description,
      },
      {
        where: {
          id: taskId,
        },
      }
    );
    return res.status(200).json({ message: "Task updated successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({
      where: {
        id:taskId,
      },
    });
    await task.destroy();
    return res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports.read = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({
      where: {
        id: taskId,
      },
    });
    return res.status(200).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports.userReadAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.findAll({
      where: {
        userId,
      },
    });
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports.adminReadAll = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({});
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
