import strings from "../localizations/screen";
const isFieldEmpty = field => {
    return !field || (typeof field === 'string' && !field.trim());
};

// validates OTP Code
export const validateOTP = (otp) => {
    if (!otp.trim() || otp.length !== 6 || !/^\d+$/.test(otp)) {
        return { isValid: false, errorMessage: strings.otpValidation };
    }
    return { isValid: true, errorMessage: null };
};

// validates password
export const validatePassword = (password) => {
    if (password.length < 8) {
        return { isValid: false, errorMessage: strings.eightCharacterPasswordValidation };
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return { isValid: false, errorMessage: strings.strengthPasswordValidation };
    }
    return { isValid: true, errorMessage: null };
}

// validates confirm password
export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return { isValid: false, errorMessage: strings.passwordDoesnotMatchValidation };
    }
    return { isValid: true, errorMessage: null };
}

// validate mobile number
export const validateMobile = (mobile) => {
    if (!mobile.trim() || mobile.length !== 10 || !/^\d+$/.test(mobile)) {
        return { isValid: false, errorMessage: strings.mobileValidation };
    }
    return { isValid: true, errorMessage: null };
}

// validates reset password
export const validateResetPassword = ( {otp,newPassword,confirmNewPassword}) => {
    const otpValidation = validateOTP(otp);
    if (!otpValidation.isValid) {
        return otpValidation; // Return the OTP validation result with error message.
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        return passwordValidation; // Return the password validation result with error message.
    }

    const confirmPasswordValidation = validateConfirmPassword(newPassword, confirmNewPassword);
    if (!confirmPasswordValidation.isValid) {
        return confirmPasswordValidation; // Return the confirm password validation result with error message.
    }

    return { isValid: true, errorMessage: null }; // Return success if all validations pass.
};

// validates registed user
export const validateResigter = ({ registerUser, retypePassword }) => {
    if (isFieldEmpty(registerUser.name)) {
        return { isValid: false, errorMessage: strings.enterName };
    }

    if (isFieldEmpty(registerUser.mobile)) {
        return { isValid: false, errorMessage: strings.enterMobile };
    }

    const mobileValidation = validateMobile(registerUser.mobile);
    if (!mobileValidation.isValid) {
        return mobileValidation; // Return the mobile validation result with error message.
    }

    if (isFieldEmpty(registerUser.userType)) {
        return { isValid: false, errorMessage: strings.enterUserType };
    }

    if (isFieldEmpty(registerUser.password)) {
        return { isValid: false, errorMessage: strings.enterPassword };
    }

    const passwordValidation = validatePassword(registerUser.password);
    if (!passwordValidation.isValid) {
        return passwordValidation; // Return the password validation result with error message.
    }

    if (isFieldEmpty(retypePassword)) {
        return { isValid: false, errorMessage: strings.enterRePassword };
    }

    const confirmPasswordValidation = validateConfirmPassword(registerUser.password, retypePassword);
    if (!confirmPasswordValidation.isValid) {
        return confirmPasswordValidation; // Return the confirm password validation result with error message.
    }

    return { isValid: true, errorMessage: null }; // Return success if all validations pass.

};
