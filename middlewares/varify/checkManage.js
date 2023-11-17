import jwt from "jsonwebtoken";
const varifyManager = (req, res, next) => {
  // const token=req.cookies?.token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbWltQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IlRhbmppbCIsImxhc3ROYW1lIjoiSG9zc2FpbiIsInJvbGUiOiJtYW5hZ2VyIiwiaXNWYXJpZmllZCI6dHJ1ZSwiX2lkIjoiNjU1NzY4ODY4OTZjM2NmZjE3ZDNjZjdlIiwiaWF0IjoxNzAwMjI3NjE3LCJleHAiOjE3MDA0ODY4MTd9.BYQUF-xn1JcjqkDMbTuFCJNlWHjre2a70WLsyCjNVWo";
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send({ message: "Unauthorized access !" });
    }
    if (decoded?.isVarified == false) {
      return res.status(403).send({ message: "Forbidden !" });
    }
    if (decoded?.role === "employee") {
      return res.status(403).send({ message: "Forbidden !" });
    }

    req.manager = decoded;

    next();
  });
};
export default varifyManager;
