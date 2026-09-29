import { Users } from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const profileUser = async(req, res) => {
    try{
        const user = await Users.findOne({ where:{ id_user: req.params.id_user }, attributes:['id_user', 'username', 'email', 'role']});
        if(!user) return res.status(404).json({ message: "User Not Foun !" });
        
        return res.status(200).json({
            data: user,
            message: "This is Your Profile ..."
        });
    }catch(err){
    return res.status(500).json({
        message: err.message
    });
}
}

export const registerUser = async (req, res) => {
  try {
    const { username, email, role, password, confPassword } = req.body;

    if (!username || !email || !password || !confPassword) {
        return res.status(400).json({ message: "Data tidak lengkap!" });
    }
  
    if (password !== confPassword) {
        return res.status(400).json({
            message: "Password dan Konfirmasi Password tidak cocok!"
        });
    }

     // check if Email Already Exists
    const exitingUser = await Users.findOne({ where : {email} });
    if(exitingUser){
        return res.status(400).json({
            message: "Email sudah terdaftar!"
        });
    }

    const targetRole = role ? role.toLowerCase() : "kasir";
    if (!["admin", "kasir"].includes(targetRole)) {
        return res.status(400).json({ message: "Role tidak valid!" });
    }

    // Role admin hanya boleh 1
    if (targetRole === "admin") {
        const adminCount = await Users.count({ where: { role: "admin" } });
        if (adminCount >= 1) {
            return res.status(400).json({
                message: "Role admin sudah terdaftar! Role admin hanya boleh 1."
            });
        }
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const payload = {
        username,
        email,
        role: targetRole,
        password: hashPassword
    };

    const user = await Users.create(payload);

   
    return res.status(201).json({
        data: {
            id_user: user.id_user,
            username: user.username,
            email: user.email,
            role: user.role
        },
        message: "User berhasil didaftarkan!"
    });
  
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
    try { 
        const user = await Users.findOne({ where: {email :  req.body.email } });
        if(!user) return res.status(404).json({ message: "User Not Found !" });

        const matchPassword = await bcrypt.compare(req.body.password, user.password);
        if(!matchPassword) return res.status(400).json({ message: "Wrong Password !" });

        // payload
        const userId = user.id_user;
        const username = user.username;
        const email = user.email;
        const role = user.role;

        // generate-token             payload, secret, options
        const accessToken = jwt.sign({userId, username, email, role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '9h'});
        const refreshToken = jwt.sign({ userId, username, email, role}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'});

        // update refresh_token + last_login in database
        await Users.update({  refresh_token : refreshToken, last_login: new Date() }, { where: {id_user: userId} });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1-day
        });

        res.status(200).json({
            data: accessToken,
            message : "Loggin Successfully !"
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const logOutUser = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(204).json({ message: "No content!" });

    const user = await Users.findOne({ where: { refresh_token: refreshToken } });
    if(!user) return res.status(204).json({ message: "Cannot Logout or Something Went Wrong!" });

    const userId = user.id_user;
    await Users.update({ refresh_token: null, last_logout: new Date() }, { where: { id_user: userId } });

    res.clearCookie('refreshToken');
    return res.status(200).json({ message: "Logout Successfully !" });
}

// access_token : belum selesai