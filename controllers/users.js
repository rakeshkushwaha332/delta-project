
const User = require("../models/user")




module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // Use the saved URL or fallback
    console.log("Redirecting to:", redirectUrl); // Debugging
    delete req.session.redirectUrl; // Clear the redirect URL after use
    res.redirect(redirectUrl);
};


module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};











module.exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Function to generate a unique mobile number
function generateUniqueMobileNumber() {
    const timestamp = Date.now();  // Get current timestamp
    const randomNum = Math.floor(Math.random() * 10000);  // Generate a random number (e.g., between 0 and 9999)
    return `${timestamp}${randomNum}`;  // Combine timestamp and random number to create a unique mobile number
}

const mobileNumber = generateUniqueMobileNumber();
    try {   
        // Log received data
        console.log("Received data: username =", username, "email =", email);

        // Create a new user
        const newUser = new User({ email, username, mobileNumber});

        try {
            // Register the user using passport-local-mongoose
            const registeredUser = await User.register(newUser, password);
            console.log("User registered successfully:", email);

            // Auto-login after signup
            req.login(registeredUser, (err) => {
                if (err) {
                    console.log("Error during login:", err.message);
                    return next(err);
                }

                // Log successful login
                console.log("User logged in successfully:", email);
                req.flash("success", "Welcome to Wanderlust!");

                // Redirect to the saved URL or fallback to "/listings"
                const redirectUrl = req.session.redirectUrl || "/listings"; // Use the saved URL or fallback
                delete req.session.redirectUrl; // Clear the redirect URL after use
                console.log("Redirecting to:", redirectUrl);

                res.redirect(redirectUrl);
            });
        } catch (registerErr) {
            console.log("Error registering user:", registerErr.message);
            return next(registerErr);
        }
    } catch (err) {
        console.log("Error in signup process:", err.message);
        return next(err);
    }
};
