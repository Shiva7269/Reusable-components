const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
	const { userName, email, password, privilege, branchId } = req.body;
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).send('Email already in use.');
		}

		// Optional: Validate branchId exists
		const branchExists = await Branch.findById(branchId);
		if (!branchExists) {
			return res.status(400).send('Invalid branch ID.');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			userName,
			email,
			password: hashedPassword,
			privilege,
			branchId
		});

		await newUser.save();
		res.status(201).send('User successfully registered.');
	} catch (error) {
		// Log and respond with the error
		console.error('Registration error:', error);
		res.status(500).send('Error registering new user.');
	}
};

exports.login = async (req, res) => {
	const { usernameOrEmail, password } = req.body;
	try {
		const user = await User.findOne({
			$or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }]
		});

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).send('Invalid credentials');
		}

		const token = jwt.sign(
			{ userId: user._id, userName: user.userName, privilege: user.privilege, branchId: user.branchId },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.json({ token });
	} catch (error) {
		res.status(500).send('Server error');
	}
};
