// each of the 'validate' methods must return a errors and a boolean value of true or false
const User = require('../models/User')

// performs the regex check to see if email meets regex requirements
const emailIsNotValid = (email) => {
    const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    return !email.match(regEx);
};

const validateUpdate = async (email, username) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }
    const user = await User.find({username});
    console.log('user:', user);

    if(user){
        errors.username = 'username is already taken';
    }

    if (emailIsNotValid(email)) {
        errors.email = "Must be a valid email";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

const validateUser = (username, email, password, confirmPassword) => {
    const errors = {};
    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }
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

module.exports = {
    validateUser,
    validateLogin,
    validateUpdate,
};
