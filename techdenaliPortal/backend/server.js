require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const crypto = require('crypto');

const { sendEmailSMTP } = require('./mailsender');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('MongoDB Connected');

		// Start the server
		app.listen(5001, '0.0.0.0', () => {
			console.log("Server is running on port 5001");
		});
	})
	.catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');
const Contact = require('./models/contact'); //added by shiva


// Registration Endpoint
app.post('/api/register', async (req, res) => {
    try {
        console.log(' req.body:', req.body);
        const { userName, email, password } = req.body;
        const lowercasedEmail = email.toLowerCase();
        const lowercasedUserName = userName.toLowerCase();
       
       //added by shiva
        const existingUserName = await User.findOne({ userName: lowercasedUserName });
        const existingUserEmail = await User.findOne({ email: lowercasedEmail });
        if(existingUserName && existingUserEmail){
            return res.status(400).send('Email & Username already in use');
        }
        // Check if email already exists
        if (existingUserEmail) {
            return res.status(400).send('Email already in use');
        }

        // Check if username already exists
        
        if (existingUserName) {
            return res.status(400).send('Username already in use');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            userName: lowercasedUserName,
            email: lowercasedEmail,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).send('The user account has been successfully registered.');

        const to = lowercasedEmail; // Use the lowercased email for sending
        const subject = "Account created successfully - Custom Portal";
        const htmlContent = `
    <p>Dear <strong>${lowercasedUserName}</strong>,</p>
    <p>Welcome to the Custom Portal!</p>
    <p>We are delighted to inform you that your account has been successfully created. You are now part of our community.</p>
    <p>Please wait while we verify your account. You will receive a notification once your account is approved. You will then be able to login to our Portal.</p>
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
    <p>Once again, welcome aboard!</p>
    <p>Best regards,<br> The Custom Portal Team</p>
`;

        await sendEmailSMTP(to, subject, htmlContent);
    } catch (error) {
        console.error('Error Details:', error); // Log the error details for debugging
        res.status(500).send(`Internal server Error: ${error.message}`);
    }
});


//added by shiva
app.post('/api/contact_us', async (req, res) => {
    const { name, email, phone, message } = req.body;
  
    try {
      // Save contact form data to MongoDB
      const newContact = new Contact({
        name,
        email,
        phone,
        message
      });
  
      await newContact.save();
  
      // Send email
      const to = 'sunayana.lakki@techdenali.com'; // Replace with your recipient email
      const subject = 'New Contact Form Submission';
      const htmlContent = `
        <p>Name: <strong>${name}</strong></p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>
      `;
  
      await sendEmailSMTP(to, subject, htmlContent);
  
      res.status(201).json({ msg: 'Form data saved and email sent successfully' });
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
    
  });
  app.post('/api/login', async (req, res) => {
    try {
        console.log('Login Hitted :',req.body);
        const lowercasedEmail = req.body.usernameOrEmail.toLowerCase();
        // Find user by username or email
        const user = await User.findOne({
            $or: [{ userName: req.body.usernameOrEmail }, { email:lowercasedEmail}]
        });

        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        if (user.status !== 'active') {
            return res.status(400).send('User account is not active'); // Return an error if the status is not "active"
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            let branchName = null;  // Initialize as null

            // Only retrieve the branch if it exists and user is not an Admin
            if (user.branchId && user.privilege !== "Admin") {
                const branch = await Branch.findById(user.branchId);

                // If branchId is present but no branch is found, return an error unless the user is an Admin
                if (!branch) {
                    return res.status(400).send('Branch not found');
                }

                // If branch is found, set branchName
                branchName = branch.branchName;
            }

            // Create a token
            const token = jwt.sign({
                userId: user._id,
                userName: user.userName,
                privilege: user.privilege,
                branchId: user.branchId,  // Keep branchId, could be null for Admins or in cases where branch is not assigned
                branchName: branchName  // This can be null for Admins
            }, JWT_SECRET, { expiresIn: '1h' });

            const sText = "Login Successful..."
            res.json({ token, sText }); // Send the token and text to the client
        } else {
            res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// POST route to add a new user
app.post('/api/users', async (req, res) => {
	const { userName, email, password, status } = req.body;

	try {
		// Check if a user with the given userName already exists
		const existingUser = await User.findOne({ userName });
		if (existingUser) {
			return res.status(400).json({ message: 'Username already exists' });
		}

		// Create a new user instance
		const newUser = new User({
			userName,
			email,
			password,
			status,
			// Add other fields as necessary, according to your User model
		});

		// Save the new user to the database
		const user = await newUser.save();
		console.log("Saved user:", user); // Log the saved user
		res.json(user);
	} catch (err) {
		console.error("Error saving user:", err); // Log the error
		// Send a more specific error message based on the error code
		if (err.code === 11000) {
			res.status(400).json({ message: 'Email or username already exists' });
		} else {
			res.status(500).json('Error: ' + err.message);
		}
	}
});

app.get('/api/users/count', async (req, res) => {
	try {
		// Extract branchId from query parameters
		const { branchId } = req.query;

		// Build a query object based on the branchId if it's provided
		const query = branchId ? { branchId } : {};

		// Use the query object to filter documents and count
		const count = await User.countDocuments(query);
		res.json({ count });
	} catch (error) {
		console.error('Error fetching user count:', error);
		res.status(500).send('Internal Server Error');
	}
});


app.get('/api/users', async (req, res) => {
	try {
		const users = await User.find(); // Fetch all users
		// Transform the data if necessary, or just send it as is
		res.json(users.map(user => ({
			_id: user._id,
			userName: user.userName,
			email: user.email,
			status: user.status,
			privilege: user.privilege,
		})));
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).send('Internal Server Error');
	}
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
	try {
		const deletionResult = await User.findByIdAndDelete(req.params.id);
		if (!deletionResult) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).send('Internal Server Error');
	}
});


// Update a user's information
app.patch('/api/users/:id', async (req, res) => {
	try {
		const { userName, email } = req.body; // Adjust according to what you allow to update
		// Optionally, perform validation or check for existing data
		const updatedUser = await User.findByIdAndUpdate(req.params.id, {
			userName,
			email,
			// Add other fields as necessary
		}, { new: true }); // Returns the updated document
		res.json(updatedUser);
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.patch('/api/users/:id/toggle-status', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		user.status = user.status === 'active' ? 'inactive' : 'active'; // Toggle status
		await user.save();

		const loginLink = `${process.env.PUBLIC_URL}/login`;

		if (user.status === 'active') {
			const to = user.email; // Get user's email address
			const subject = 'Account activated - Custom Portal';
			const htmlContent = `<p>Dear <strong>${user.userName}</strong>,</p>
                                <p>Your account on the Custom Portal has been activated. You can now <a href="${loginLink}">log in</a> and start using our services.</p>
                                <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
                                <p>Best regards,<br> The Custom Portal Team</p>`;

			// Assuming sendEmailSMTP is an async function you've defined to send emails
			const result = await sendEmailSMTP(to, subject, htmlContent);
			console.log('Email sent result:', result);
		} else if (user.status === 'inactive') {
			const to = user.email; // Get user's email address
			const subject = 'Account Deactivation Notice - Custom Portal';
			const htmlContent = `<p>Dear <strong>${user.userName}</strong>,</p>
                         <p>Your account on the Custom Portal has been deactivated. If you believe this is an error or wish to reactivate your account, please contact our support team.</p>
                         <p>Best regards,<br> The Custom Portal Team</p>`;

			// Assuming sendEmailSMTP is an async function you've defined to send emails
			const result = await sendEmailSMTP(to, subject, htmlContent);
			console.log('Email sent result:', result);
		}

		res.json({ status: user.status });
	} catch (error) {
		console.error('Error toggling user status:', error);
		res.status(500).send('Internal Server Error');
	}
});
// Add a new endpoint for changing password
//added by shiva
app.post('/api/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Validate the new password (e.g., length, complexity)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'New password must contain at least 8 characters including one letter, one number, and one special character' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/verify-reset-token/:token', async (req, res) => {
	const { token } = req.params;

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() } // Check if the token has not expired
		});

		if (!user) {
			return res.status(400).json({ message: 'This token is invalid or has expired.' });
		}

		// Token is valid
		res.json({ message: 'The token is valid.', user: { id: user._id, email: user.email } });
	} catch (error) {
		console.error('Error verifying token:', error);
		res.status(500).json({ message: 'Internal server error while verifying the token.' });
	}
});

app.post('/api/request-password-reset', async (req, res) => {
    try {
        const lowercasedEmail = req.body.email.toLowerCase();
        const user = await User.findOne({ email: lowercasedEmail });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Generate a token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `${process.env.PUBLIC_URL}/reset-password/${resetToken}`;

        const to = lowercasedEmail;
        const subject = "Password Reset Request";
        const htmlContent = `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`;

        const result = await sendEmailSMTP(to, subject, htmlContent);
        res.send({ message: 'Check your email to reset password', result: result });
        // res.json({ message: 'Check your email for the password reset link.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/reset-password/:token', async (req, res) => {
	const { token } = req.params;
	const { password } = req.body; // New password from the user

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).send({ message: 'Token is invalid or has expired.' });
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Update the user's password and clear the reset token fields
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		res.send({ message: 'Password has been reset successfully.' });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Internal Server Error' });
	}
});