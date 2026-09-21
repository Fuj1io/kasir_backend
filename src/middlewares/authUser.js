import jwt from "jsonwebtoken";
import { Users } from "../models/UserModel.js";

export const authUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({ message: "Access Denied !" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(error, decoded) => {
        if(error) return res.status(403).json({ message: "Invalid Token" });

        const checkRefreshToken = await Users.findOne({where: { id_user : decoded.userId}});
        if(!checkRefreshToken || !checkRefreshToken.refresh_token) return res.status(401).json({message: "Access dilarang !"});

        req.userId = decoded.userId;
        req.email = decoded.email;
        req.role = checkRefreshToken.role || decoded.role;
        next();

    });
}

export const adminOnly = (req, res, next) => {
    if (req.role?.toLowerCase() !== "admin") {
        return res.status(403).json({ message: "Akses dilarang! Hanya admin yang diizinkan." });
    }
    next();
};