import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./forgotpassword.module.css";
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert } from "@mui/material";

const ForgotPassword = () => {
    const [data, setData] = useState({ email: "", newPassword: "", confirmPassword: "" });
    const [success, setSuccess] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Handle form input change
    const handleChange = ({ target: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    // Handle password reset request
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:5001/api/reset-password";
            const { data: res } = await axios.post(url, data);

            setSnackbarMessage(res.message);
            setSuccess(true);
        } catch (error) {
            console.error("Reset password error:", error.response || error);
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setErrorSnackbar(error.response.data.message);
            } else {
                setErrorSnackbar("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <>
            {/* Navbar */}
            <AppBar position="static" style={{ background: "#1a1a2e" }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        style={{
                            flexGrow: 1,
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "white",
                        }}
                    >
                        CareerHub
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/about">About</Button>
                    <Button color="inherit" component={Link} to="/contact">Contact</Button>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                </Toolbar>
            </AppBar>

            <div className={styles.container}>
                <div className={styles.form_container}>
                    <div className={styles.left}>
                        <form className={styles.form} onSubmit={handleReset}>
                            <h1>Reset Password</h1>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                value={data.email}
                                required
                                className={styles.input}
                            />
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                onChange={handleChange}
                                value={data.newPassword}
                                required
                                className={styles.input}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                value={data.confirmPassword}
                                required
                                className={styles.input}
                            />
                            <button type="submit" className={styles.green_btn}>
                                Reset Password
                            </button>
                            <div className={styles.forgot_password}>
                                <Link to="/login" className={styles.link}>
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                    <div className={styles.right}>
                        <h1>CareerHub</h1>
                    </div>
                </div>
            </div>

            {/* Success Snackbar */}
            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar open={errorSnackbar !== ""} autoHideDuration={3000} onClose={() => setErrorSnackbar("")}>
                <Alert onClose={() => setErrorSnackbar("")} severity="error" sx={{ width: "100%" }}>
                    {errorSnackbar}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ForgotPassword;
