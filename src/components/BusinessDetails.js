import "../styles/Signup.css";

const BusinessDetails = ({
    businessName,
    setBusinessName,
    businessAddress,
    setBusinessAddress,
    businessNumber,
    setBusinessNumber,
    gstNumber,
    setGSTNumber,
    taxFile,
    setTaxFile,
    businessContact,
    setBusinessContact,
    businessCity,
    setBusinessCity,
    businessPostalCode,
    setBusinessPostalCode,
    businessProvince,
    setBusinessProvince,
}) => {
    return (
        <div>
            <div className="form-group">
                <label>Business Name:</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Business Number (BIN):</label>
                <input type="text" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
            </div>
            <div className="form-group">
                <label>GST/HST Number:</label>
                <input type="text" value={gstNumber} onChange={(e) => setGSTNumber(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Tax File:</label>
                <input type="file" key={taxFile ? taxFile.name : 'taxFile'}  onChange={(e) => { setTaxFile(e.target.files[0]); }} />
            </div>
            <div className="form-group">
                <label>Contact Number:</label>
                <input type="text" value={businessContact} onChange={(e) => setBusinessContact(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Address:</label>
                <input type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
            </div>
            <div className="form-group">
                <label>City:</label>
                <input type="text" value={businessCity} onChange={(e) => setBusinessCity(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Postal Code:</label>
                <input type="text" value={businessPostalCode} onChange={(e) => setBusinessPostalCode(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="province">Province:</label>
                <select id="province" value={businessProvince} onChange={(e) => setBusinessProvince(e.target.value)}>
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


export default BusinessDetails;