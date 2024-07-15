const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
	password: { type: String, required: true },
	registrationDate: { type: Date, default: Date.now },
	privilege: {
		type: String,
		required: true,
		enum: ['Admin', 'Editor', 'Viewer'],
		default: 'Viewer'
	},
	status: {
		type: String,
		default: 'inactive', // Default status is inactive
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', UserSchema);
