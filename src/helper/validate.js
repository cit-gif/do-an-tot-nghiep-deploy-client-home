import Joi from "joi";
const register = async (data) => {
	const Schema = Joi.object({
		// name: Joi.string()
		// 	.regex(/^[a-zA-Z0-9]{3,50}$/)
		// 	.required(),
		Name: Joi.string().min(3).max(50).required(),
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const login = async (data) => {
	const Schema = Joi.object({
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Password: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const addressUser = async (data) => {
	const Schema = Joi.object({
		City: Joi.string().min(3).required(),
		District: Joi.string().min(3).required(),
		Wards: Joi.string().min(3).required(),
		Details: Joi.string().min(3).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const changePassword = async (data) => {
	const Schema = Joi.object({
		NewPassword: Joi.string().min(8).required(),
		OldPassword: Joi.string().min(8).required(),
		RetypePassword: Joi.string().min(8).required(),
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
const userPayment = async (data) => {
	const Schema = Joi.object({
		Name: Joi.string().min(3).max(50).required(),
		PhoneNumber: Joi.string()
			.regex(/^[0-9]{10,10}$/)
			.required(),
		Address: {
			City: Joi.string().min(3).max(150).required(),
			District: Joi.string().min(3).max(150).required(),
			Wards: Joi.string().min(3).max(150).required(),
			Details: Joi.string().min(3).max(150).required(),
		},
	});
	try {
		return await Schema.validateAsync(data);
	} catch (error) {
		return {
			error,
		};
	}
};
export default {
	register,
	login,
	addressUser,
	changePassword,
	userPayment,
};
