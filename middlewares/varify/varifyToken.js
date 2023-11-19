import jwt from "jsonwebtoken";
const verifytoken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "unauthorized access !" });
  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      return res
        .clearCookie("token", { maxAge: 0 })
        .status(401)
        .send({ message: "unauthorized access !" });
    }
    req.user = decode;
    next();
  });
};
export default verifytoken;
