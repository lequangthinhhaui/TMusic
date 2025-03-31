const { app } = require("electron");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const userDataPath = app.getPath("userData"); // Safe, writable location
const dbPath = path.join(userDataPath, "tasks.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
});

// Define Task Model
const Task = sequelize.define("Task", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  task: { type: DataTypes.STRING, allowNull: false },
});

// Initialize Database
(async () => {
  await sequelize.sync();
  console.log("Database Path:", dbPath);
})();

async function getTasks() {
  return await Task.findAll({ raw: true });
}

async function addTask(taskText) {
    const task = await Task.create({ task: taskText });
    return task.get({ plain: true }); // ✅ Ensure no metadata is returned
}

async function deleteTask(id) {
  return await Task.destroy({ where: { id } });
}

module.exports = { getTasks, addTask, deleteTask };