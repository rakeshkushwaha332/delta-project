
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

    // Create a new user
    const newUser = new User({ email, username });

    // Register the user using passport-local-mongoose
    const registeredUser = await User.register(newUser, password);

    // Auto-login after signup
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");

        // Redirect to the saved URL or fallback to "/listings"
        const redirectUrl = req.session.redirectUrl || "/listings"; // Use the saved URL or fallback
        delete req.session.redirectUrl; // Clear the redirect URL after use
        res.redirect(redirectUrl);
    })};
