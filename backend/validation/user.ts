import { query, validationResult, body, matchedData } from "express-validator";

export const createUserValidationSchema = {
  firstName: {
    isLength: {
      options: { min: 4, max: 32 },
      errorMessage: "firstame cannot be less than 3",
    },
    notEmpty: { errorMessage: "firstname can not be empty" },
    isString: { errorMessage: "firstname is a string" },
  },

  lastName: {
    notEmpty: { errorMessage: "lastname can not be empty" },
    isString: { errorMessage: "lastname is a string" },
  },

  email: {
    notEmpty: { errorMessage: "email cannot be empty" },
    isEmail: { errorMessage: "Enter a valid email" },
  },

  password: {
    notEmpty: { errorMessage: "Password cannot be empty" },
    isLength: { options: { min: 8 }, errorMessage: "password cannot be less than 6" },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
      errorMessage: "Password must contain at least a digit, symbol, uppercase and lowercase",
    },
  },

  address: {
    notEmpty: { errorMessage: "Address cannot be empty" },
  },

  phone: {
    notEmpty: { errorMessage: "Phone number cannot be empty" },
    isInt: { errorMessage: "only number allowed" },
  },
};
