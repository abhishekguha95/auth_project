import Joi from 'joi';

const userDataFormSchema = Joi.object({
    username: Joi.string().trim().min(3).max(10).required().messages({
        'any.required': 'username key/val missing',
        'string.base': 'username should be string', //
        'string.empty': 'username is not allowed to be empty',
        'string.min': 'username should be greater than 2 char: min 3 allowed',
        'string.max': 'username should be less than 11 char: max 10 allowed',
    }),
    password: Joi.string().trim().min(3).max(10).required().messages({
        'any.required': 'password key/val missing',
        'string.base': 'password should be string',
        'string.empty': 'password is not allowed to be empty',
        'string.min': 'password should be greater than 2 char: min 3 allowed',
        'string.max': 'password should be less than 11 char: max 10 allowed',
    }),
});

export default userDataFormSchema;
