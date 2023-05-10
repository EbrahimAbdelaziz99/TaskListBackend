const { sign, verify, decode } = require("jsonwebtoken");
const Task = require("./models/task");

const createToken = (user) => {
  const payload = {
    username: user.username,
    email: user.email,
    id: user.id,
    admin: user.admin,
  };
  const secret = process.env.JWT_SECRET;
  const accessToken = sign(payload, secret, {
    expiresIn: "7 days",
  });
  return accessToken;
};

const isAuthenticated = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: "user is not authenticated" });
  }
  try {
    const secret = process.env.JWT_SECRET;
    const validToken = verify(accessToken, secret);
    if (validToken) {
      let decoded = decode(accessToken);
      req.user = {
        email: decoded.email,
        admin: decoded.admin,
        id: decoded.id,
        username:decoded.username,
      };
      return next();
    }
  } catch (error) {
    return res.status(401).json({ error: "User is not authenticated!" });
  }
};

const isAdmin = async (req, res, next) => {
  if (!req.user.admin) {
    return res.status(401).json({ error: "User is not admin!" });
  } else {
    next();
  }
};

const isOwner = async (req,res,next) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const task = await Task.findOne({
            where: {
                id: id
            },
        })
        if(!task.userId === userId) {
            return res.status(401).json({ error: "User is not owner!" });
        }else {
            next()
        }
    } catch (error) {
        return res.status(500).json({ error: "User is not owner!" });
    }
    
}
module.exports = {
  createToken,
  isAuthenticated,
  isAdmin,
  isOwner
};
