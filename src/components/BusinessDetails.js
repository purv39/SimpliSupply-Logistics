import "../styles/Signup.css";

const BusinessDetails = ({
    businessName,
    setBusinessName,
    businessAddress,
    setBusinessAddress,
    businessNumber,
    setBusinessNumber
}) => {
    return (
        <div>
            <div className="form-group">
                <label>Business Name:</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Business Address:</label>
                <input type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Business Number (BIN):</label>
                <input type="text" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
            </div>
        </div>
    );
}


export default BusinessDetails;