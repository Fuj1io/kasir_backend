import jwt from "jsonwebtoken";
import {Users} from "../models/UserModel.js";

export const refreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(404).json('Not Found !');

        const user = await Users.findOne({ where: { refresh_token: refreshToken }});
        if(!user) return res.status(403).json('Forbidden !');

        //          token ,     secre_key,  options
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.status(403).json({ message: "Invalid  Refresh Token.." });

            const userId = user.id_user;
            const username = user.username;
            const email = user.email;
            const role = user.role;

            //       payload,                       secret_key,                         option   
            const accessToken  = jwt.sign({ userId, username, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn : "1d" });
            
            return res.status(200).json({ data: accessToken, message: "Refresh Token Success !" });
        });
    }catch(err){
        return res.status(500).json({ message: "Refresh Token Failed !" });
    }
}