const express = require('express');
const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');

exports.signup = async (req, res) => {
    console.log( 'user sign up request', req.body);

    const { email,  password } = req.body;

    if(!email || !password) {
        return res.status(400).send({ message: 'Missing email or password'});
    }

    try {
        const existingUser = await userModel.findOne({ email: email });
        if(existingUser) {
            return res.status(400).send('user already exists');
        }

    //   const saltRounds = 10;
    //   const salt = await bcrypt.genSalt(saltRounds);
    //   const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({ email, password });
      await newUser.save();
      
      res.status(201).send('Used signed up successfully');

    } catch(err) {
        console.log("signup error:", err );
        res.status(500).send({ message: 'Server error', error: err });
    }

    // res.status(201).send('Used sign up route');
}


exports.signin = async (req, res) => {
    console.log( 'user sign in request', req.body);

    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' } );
    }

    try{
        const existingUser = await userModel.findOne({ email });
        if(!existingUser) {
            return res.status(400).json( { message: "user doesn't exists"} );
        }

        //compare user input password with the hashpassword
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch) {
            res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: existingUser._id, 
            email: existingUser.email },
            process.env.JWT_SECRET, 
            {expiresIn: '1h'});

        res.status(200).json( { message: 'Used sign in successfully', token: token } );
    } catch(err) {
        console.log("signin error:", err );
        res.status(500).json({message: 'Server error', error: err});
    }
   
}



exports.getUserDetail = async (req, res) => {
    console.log("console get user detail request", req.user);
    res.status(200).json({ message: `user details: ${req.user.email}`});

    try{
        console.log("Incoming request", req.user);
        const user = await userModel.findOne({ _id: req.user.id });
        res.status(200).json({ email: user.email });
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}



exports.getAllUsers = async (req, res) => {
    try{
        console.log("get all users request", req.user);
        const users = await userModel.find();
        res.status(200).json({ users: users });
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}

//update user function. admin can update and the person logged in can also update. so sendin this 
// as params
exports.updateUser = async (req, res) => {
    const { id, email } = req.params;

    try{
        const updatedUser = await userModel.findByIdAndUpdate(id, {email: email} );
        userModel.save();

        if(!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch(err) {
        res.status(500).json({ message: err.message});
    }

}




exports.deleteUser = async (req, res) => {
    console.log("user delete request", req.params);
    const { id } = req.params;

    try{
        const deletedUser = await userModel.findByIdAndDelete(id);

        if(!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully', user: deletedUser });

    } catch(err) {
        res.status(500).send({ message: 'Server error', error: err });
    }
}
