import jwt from "jsonwebtoken";
const verifyManager = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .clearCookie("token", { maxAge: 0 })
        .send({ message: "Unauthorized access !" });
    }
    if (decoded?.isVerified == false) {
      return res.status(403).send({ message: "Forbidden !" });
    }
    if (decoded?.role === "employee") {
      return res.status(403).send({ message: "Forbidden !" });
    }

    req.manager = decoded;

    next();
  });
};
export default verifyManager;
