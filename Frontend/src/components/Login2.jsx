import React, { useEffect, useState } from "react";
import axios from "axios";

const Login2 = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:8000/api/v1/students/auth/linkedin";
    };

    return (
        <div>
            <button onClick={handleLogin}>Sign In with LinkedIn</button>
        </div>
    );
};

export default Login2;
