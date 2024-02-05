import "../styles/Signup.css";

const SetupAccount  = ({
    email,
    setEmail,
    password,
    setPassword
}) => {
    return (
        <div>
            <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
    );
}


export default SetupAccount;