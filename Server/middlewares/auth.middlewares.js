import jwt from "jsonwebtoken";

import AppError from "../utils/error.util.js";

/**
 * @isLoggedIn - Middleware to check if the user is authenticated.
 * Verifies the JWT token from the cookies and attaches the user details to the request object.
 * If no token is present or invalid, it returns an "Unauthenticated" error.
 */

const isLoggedIn = async (req, res, next)=>{
    const {token}= req.cookies;

    if(!token){
        return next(new AppError('Unauthenticated, pls login  again ', 401));
    }
    const userDetails= await jwt.verify(token , process.env.JWT_SECRET );

    req.user = userDetails;

    next();
}
/**
 * @authorizedRoles - Middleware to check if the user has authorized roles.
 * It ensures that the current user has one of the roles required to access the route.
 */
const authorizedRoles = (...roles)=>async(req, res, next)=>{
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next (
            new AppError("You do not have permission to access this route", 403)
        )
    }
    next();
}

export{
    isLoggedIn,
    authorizedRoles
}
    
