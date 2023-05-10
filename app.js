if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const cookieParser = require("cookie-parser");
const sequelize = require('./utils/dbConfig');

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 
const User = require('./models/user');
const Task = require('./models/task');

// database connection and relations
User.hasMany(Task);
Task.belongsTo(User);

sequelize
  .authenticate()
  // use the next line to drop the database and initialize it when needed.
  // .then(sequelize.sync({force:true}))
  .then(
    sequelize
      .sync()
      .then((result) => {
        console.log('Connected and sync successfully');
      })
      .catch((error) => {
        console.log(error);
      })
  )
  .catch((error) => {
    console.log(error);
  });

/////
const { isAuthenticated } = require("./authMiddleware");

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.get('/home' , (req,res) => {
    res.send('Hello World!')
})

app.use('/task',isAuthenticated, taskRoutes);
app.use('/user', userRoutes);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}, http://localhost:${port}/home`)
})