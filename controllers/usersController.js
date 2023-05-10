const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const { createToken } = require("../authMiddleware");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { admin, email, username, password, confirmPassword } = req.body;
    //check if usrname or email already exists
    const user = await User.findAll({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });
    if (user.length) {
      return res.status(409).json({ error: "User already exists" });
    }
    if (password === confirmPassword) {
      // hashing the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        username: username,
        email: email,
        password: hashedPassword,
      };

      // add the user as "admin" if the admin attribute is true
      if (admin) {
        newUser.admin = admin;
      }

      await User.create(newUser);
      res.status(200).json({ message: "successfully registered" });
    }
  } catch (error) {
    return res.status(500).json({ error, message: "Error registering !!" });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "'Invalid Email or Password'" });
    } else {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        return res.status(400).json({ error: "'Invalid Email or Password'" });
      }
      if (correctPassword) {
        const accessToken = createToken(user);
        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
        });
        const { username } = user;
        res.status(200).json({
          success: true,
          message: "User logged In",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error, message: "Error Logging in !!" });
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error, message: "Error Logging out !!" });
  }
};

//// logic for the reset password process /////

module.exports.resetMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please Enter a Valid Email address" });
    }

    const payload = {
      email: email,
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, {
      expiresIn: "1 days",
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: user.email,
      from: "eabdelaziz3699@gmail.com",
      subject: "Tasks account Password Reset",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://" +
        req.headers.host +
        "/reset/" +
        token +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    await sgMail.send(msg);

    res.status(200).json({ message: `Email was sent to : ${email}` });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports.resetToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return res.status(401).json({ error: "no token!" });
  const secret = process.env.JWT_SECRET;
  const validToken = jwt.verify(token, secret);
  console.log(validToken);
  if (validToken) {
    const email = validToken.email;
    res.status(200).send(`token :${token}, email:${email}`);
    // this should be used in the frontend to let the user reset his password
  } else {
    return res.status(401).json({ error: "Invalid or Expired Token" });
  }
};

module.exports.reset = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(401).json({ error: "no token!" });
    }
    const email = validToken.email;
    console.log(email);
    const { password, confirmPassword } = req.body;
    if (password === confirmPassword) {
      // hashing the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const updatedPassword = {
        password: hashedPassword,
      };
      await User.update(updatedPassword, {
        where: {
          email,
        },
      });
      return res.status(200).json({ message: "password was updated successfully!" });
    } else {
      return res.status(400).json({ error,message : "password isn't matching!" });
    }
  } catch (error) {
    return res.status(400).json({ error, message : "error accured!" });
  }
};
