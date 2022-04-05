import { navigate } from "raviger";
import React, { useEffect, useState } from "react"
import { login } from "../utils/APIMethods";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            localStorage.removeItem("token");
            navigate("/")
        };
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(username, password).then(res => {
            localStorage.setItem("token", res.token);
            navigate("/");
        }).catch(err => {
            alert(err.message);
        });
    }

    return (
        <div className="w-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <form onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <div className="my-4">
                            <label htmlFor="username" className="mb-1">Username</label>
                            <input
                                required
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                placeholder="Username"
                                onChange={e => setUsername(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div className="my-4">
                            <label htmlFor="password" className="mb-1">Password</label>
                            <input
                                required
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={e => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="my-4">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-[16px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                        >
                            Sign in
                        </button>   
                    </div>
                </form>
            </div>
        </div>
    )
}