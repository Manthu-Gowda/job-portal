
import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import User from "../models/usermodel.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'


const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    httpOnly: true,
    secure: true,
}
/**
 * @REGISTER
 * @ROUTE @POST {{URL}}/api/v1/user/register
 * @ACCESS Public
 */
export const register = asyncHandler(async (req, res, next) => {

    const { fullName, email, password } = req.body;


    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }


    const userExists = await User.findOne({ email });


    if (userExists) {
        return next(new AppError('Email already exists', 400));
    }


    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
        }
    });


    if (!user) {
        return next(new AppError('User registration failed, please try again', 400));
    }

    // TODO: FILE UPLOAD
    if(req.file){
        try {
            const result= await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill',
            });

            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                

                // remove file from local server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(new AppError(error.message||'File not uploaded , please try again',500))
        }
    }


    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions);


    res.status(201).json({
        success: true,
        message: `User Registered successfully`,
        user,
    });
});


/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @ACCESS Public
 */
export const login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return next(new AppError('All fields are required', 400));
        }


        const user = await User.findOne({
            email
        }).select('+password');


        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or Password does not match', 401));
        }

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);


        res.status(200).json({
            success: true,
            message: `user logged in successfully`,
            user,
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});


/**
 * @LOGOUT
 * @ROUTE @POST {{URL}}/api/v1/user/logout
 * @ACCESS Private, Logged In User Only
 */
export const logout = asyncHandler(async(req, res, next) => {

    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true,
    });


    res.status(200).json({
        success: true,
        message: "user logged out successfully"
    })
});


/**
 * @GET_USER_PROFILE
 * @ROUTE @POST {{URL}}/api/v1/user/me
 * @ACCESS Private, Logged In User Only
 */
export const getProfile = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if(!user){
            return next(new AppError('User not found',404));
        }
        res.status(200).json({
            success: true,
            message: "User details",
            user
        })
    } catch (error) {
        return next(new AppError('Failed to fetch profile', 500));
    }
});
/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset
 * @ACCESS Public
 */
export const forgotPassword =asyncHandler(async( req, res, next)=>{
    const {email}= req.body;

    if(!email){
        return next(new AppError("Email is required", 400));
    }

    const user= await User.findOne({email});

    if(!user){
        return next(new AppError("Email not registered", 400));
    }

    const resetToken =await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject = 'Reset Password'
    const message = `you can reset password by clicking on <a href=${resetPasswordURL} target="_blank">Reset your password</a>\n If the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}`;


    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successfully`,
        })
    } catch (error) {
        user.forgotPasswordExpiry=undefined;
        user.forgotPasswordToken=undefined;
        await user.save();
        return next(new AppError(error.message, 500));
    }
});


/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset/:resetToken
 * @ACCESS Public
 */
export const resetPassword = asyncHandler(async(req, res, next) => {
    const {resetToken} = req.params;

    const {password}=req.body;

    const forgotPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    })

    if(!user){
        return next(new AppError('Token is invalid or expired, please try again',400))
    }

    user.password=password;
    user.forgotPasswordToken=undefined;
    user.forgotPasswordExpiry=undefined;

    user.save();

    res.status(200).json({
        success:true,
        message:`Password Changed Successfully`,
    })
})
/**
 * @CHANGE_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/change-password
 * @ACCESS Private, Authenticated users only
 */
export const changePassword = asyncHandler(async(req, res,next)=>{

    const {oldPassword, newPassword}=req.body;
    const {id} = req.user;

    if(!oldPassword || !newPassword){
        return next(new AppError('All fields are mandatory',400));
    }

    const user=await User.findById(id).select('+password');

    if(!user){
        return next(new AppError('user does not exist',400));
    }

    const isPasswordValid= await user.comparePassword(oldPassword);

    if(!isPasswordValid){
        return next(new AppError("Invalid old password", 400))
    }

    user.password = newPassword;

    await user.save();

    user.password=undefined;

    res.status(200).json({
        success: true,
        message:`Password  changed Sucessfully`,
    })
})
/**
 * @UPDATE_USER - Updates the user details (name and avatar)
 */
export const updateUser=asyncHandler(async(req, res,next)=>{

    const {fullName }=req.body;
    const {id} =req.user;
    console.log(id)

    const user = await User.findById(id);

    if(!user){
        return next(new AppError("user does not exist", 400))
    }

    if(fullName){
        user.fullName=fullName;     
    }

    if(req.file){

        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        try {
            const result= await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill',
            });

            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                

                // remove file from local server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(new AppError(error.message||'File not uploaded , please try again',500))
        }
    }

    await user.save();

    res.status(200).json({
        success:true,
        message:'User details updated successfully',
        user,
    })
})

export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      message: 'All users', 
      users,
    });
  } catch (error) {
    return next(new AppError('Failed to fetch users', 500));
  }
});
