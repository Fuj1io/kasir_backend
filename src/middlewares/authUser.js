import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({ message: "Access Denied !" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error) return res.status(403).json({ message: "Invalid Token" });

        req.userId = decoded.userID;
        req.email = decoded.email;
        next();

    });
}