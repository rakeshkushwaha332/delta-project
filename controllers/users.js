const User = require("../models/user");
const logger = require("../logger");

// Helper to generate a unique mobile number
function generateUniqueMobileNumber() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `${timestamp}${randomNum}`;
}

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    logger.info("User logged in successfully");
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    if (req.session) {
        delete req.session.redirectUrl;
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        logger.info("User successfully logged out");
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

module.exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const mobileNumber = generateUniqueMobileNumber();

    try {
        logger.info(`Signup attempt: ${email}`);

        const newUser = new User({ email, username, mobileNumber });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                logger.error("Login after signup failed:", err);
                return next(err);
            }

            logger.info("Signup and login successful");
            req.flash("success", "Welcome to Wanderlust!");
            const redirectUrl = req.session?.redirectUrl || "/listings";
            if (req.session) {
                delete req.session.redirectUrl;
            }
            res.redirect(redirectUrl);
        });
    } catch (err) {
        logger.error("Signup failed:", err.message);
        next(err);
    }
};
