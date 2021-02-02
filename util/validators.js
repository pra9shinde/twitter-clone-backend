const validateRegister = (username, email, password, confirmPassword, name) => {
    const errors = {};

    if (name.trim() === "") {
        errors.name = "Name must not be empty";
    }

    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }

    if (email.trim() === "") {
        errors.email = "Email must not be empty";
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = "Enter valid email address";
        }
    }

    if (password.trim() === "") {
        errors.password = "Password must not be empty";
    } else if (password !== confirmPassword) {
        errors.password = "Passwords must match";
    }

    return {
        errors: errors,
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
        errors: errors,
        valid: Object.keys(errors).length < 1,
    };
};

module.exports = { validateRegister, validateLogin };
