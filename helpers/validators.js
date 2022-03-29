// each of the 'validate' methods must return a errors and a boolean value of true or false
const User = require('../models/User');
const bcrypt = require("bcryptjs");

// performs the regex check to see if email meets regex requirements
const emailIsNotValid = (email) => {
    const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    return !email.match(regEx);
};

const usernameIsInUse = async (username) => {
    return await User.findOne({username});
} 


const validateUserUpdate = async (email = null, username = null , currentUser) => {
    // foreach of the values you want to send through check if they are different only send through the actual differences. 
    const {email: currentEmail , username: currentUsername } = currentUser; 
    const errors = {};
    const values = {};
    
    if((email === null || email.trim() === "") &&  (username === null || username.trim() === "" )){
        errors.email = "Email must not be empty";
        errors.username = "Username must not be empty";
    }

    if(email !== null && email.trim() !== ""){
        const userWithEmail = await User.findOne({email});
        if (emailIsNotValid(email)) {
            errors.email = "Must be a valid email";
        }else if(userWithEmail && (currentEmail !== email)){ // makes sure email not in use, if it must not be someone else's email
            errors.email = 'Email is already taken';
        }else{
            values.email = email
        }
        
    }
    if(username !== null && username.trim() !== ""){
         if (await usernameIsInUse(username) && (currentUsername !== username)){ // makes sure username not in use, if it must not be someone else's username
            errors.username = 'Username is already taken';
         }else{
            values.username = username
         }
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1,
        values
    };
};

const validateUpdatePassowrd = async (userPassword, currentPassword, password, confirmPassword) => {
    const errors = {};
    const checkCurrentPassword = await bcrypt.compare(currentPassword, userPassword);
    if(!checkCurrentPassword){
        errors.wrongPassword = "Current passwrod do not match";
    }
    if (password === "") { 
        errors.password = "Password must not be empty";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Password confirmation must match new password";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
}

const validateUser = async (username, email, password, confirmPassword) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    } else if(await usernameIsInUse(username)) {
        errors.username = "Username already exist";
    }
    // check if email is in use
    if (email.trim() === "") {
        errors.email = "Email must not be empty";
    } else {
        if (emailIsNotValid(email)) {
            errors.email = "Must be a valid email";
        }
    }
    if (password === "") {
        errors.password = "Password must not be empty";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

const validateLogin = (username, password) => {
    const errors = {};
    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }
    if (password.trim() === "") {
        errors.password = "Password must not be empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

const validateRemoveAmount = async (userId, amount) => {
    let errors = {};

    const user = await User.findById(userId);

    if(amount > user.amountInWallet){
        errors.funds = "You do not have sufficient funds to perform this transaction"
    }
    if (amount < 0) {
        errors.amount = "You cannot use a negative value in transaction"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
}

const validateAmountPositive = async (amount) => {
    let errors = {}
    if (amount < 0) {
        errors.amount = "You cannot use a negative value in transaction"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
}


module.exports = {
    validateUser,
    validateLogin,
    validateUserUpdate,
    validateRemoveAmount,
    validateAmountPositive,
    validateUpdatePassowrd
}
