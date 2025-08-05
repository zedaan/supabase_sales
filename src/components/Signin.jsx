import { useAuth } from "../context/AuthContext";

const Signin = () => {
    const { session } = useAuth();
    console.log(session);
    return (
        <div>
            <h1 className="landing-header">Paper like a Boss</h1>
        </div>
    )
}

export default Signin;