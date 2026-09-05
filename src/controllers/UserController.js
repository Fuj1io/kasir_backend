import { Users } from '../models/UserModel.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  try {
    const { username, email, role, password, confPassword } = req.body;
  
    if (password !== confPassword) {
        return res.status(400).json({
            message: "Password ans Confirm Password do not Match !"
        });
    }

     // check if Email Already Exits
    const exitingUser = await Users.findOne({ where : {email} });
    if(exitingUser){
        return res.status(400).json({
            message: "Email Already Exits !"
        });
    }


    const payload = {
        username, email, role, password
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashPassword;

    const user = await Users.create(payload);

   
    return res.status(201).json({
        data: user,
        message: "User  registerd SuccessFully !"
    });
  
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

