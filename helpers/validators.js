// each of the 'validate' methods must return a errors and a boolean value of true or false
const User = require('../models/User')

// performs the regex check to see if email meets regex requirements
const emailIsNotValid = (email) => {
    const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    return !email.match(regEx);
};

const usernameIsInUse = async (username) => {
    return await User.findOne({username});
} 


const validateUserUpdate = async (email, username, currentUser) => {
    // foreach of the values you want to send through check if they are different only send through the actual differences. 
    const {email: currentEmail , username: currentUsername } = currentUser; 

    const errors = {};

    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    } else if (await usernameIsInUse(username) && (currentUsername !== username)){ // makes sure username not in use, if it must not be someone else's username
        errors.username = 'Username is already taken';
    }

    if (emailIsNotValid(email)) {
        errors.email = "Must be a valid email";
    }

    const userWithEmail = await User.findOne({email});

    if(userWithEmail && (currentEmail !== email)){ // makes sure email not in use, if it must not be someone else's email
        errors.email = 'Email is already taken';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

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
        errors.username = "Password must not be empty";
    }
    if (password.trim() === "") {
        errors.password = "Password must not be empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

const validateFundsAvailible = (currentUser) => {
    
}

module.exports = {
    validateUser,
    validateLogin,
    validateUserUpdate,
    validateFundsAvailible
};
