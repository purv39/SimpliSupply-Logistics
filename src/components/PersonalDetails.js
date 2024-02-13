import "../styles/Signup.css";

const PersonalDetails = ({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    address,
    setAddress,
    contactNumber,
    setContactNumber,
    city,
    setCity,
    province,
    setProvince,
    zipCode,
    setZipCode
}) => {
    return (
        <div>
            <div className="form-group">
                <label>First Name:</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Last Name:</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Contact Number:</label>
                <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Address:</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
                <label>City:</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Postal Code:</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="province">Province:</label>
                <select id="province" value={province} onChange={(e) => setProvince(e.target.value)}>
                    <option value="">Select Province</option>
                    <option value="AB">Alberta</option>
                    <option value="BC">British Columbia</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">New Brunswick</option>
                    <option value="NL">Newfoundland and Labrador</option>
                    <option value="NS">Nova Scotia</option>
                    <option value="NT">Northwest Territories</option>
                    <option value="NU">Nunavut</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">Prince Edward Island</option>
                    <option value="QC">Quebec</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="YT">Yukon</option>
                </select>
            </div>
        </div>
    );
}


export default PersonalDetails;