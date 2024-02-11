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
                <label>Province:</label>
                <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} />
            </div>
        </div>
    );
}


export default PersonalDetails;