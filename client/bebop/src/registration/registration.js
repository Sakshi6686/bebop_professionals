import React, { useState, useEffect} from 'react';
import './registration.css';
 

function RegistrationForm() {

  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',  
    city: 'New York',  
    userType: 'student',
    collegeName: '',
    startingYear: '',
    endingYear: '',
    companyName: '',
    designation: '',
    jobPreference: 'Software Developer', 
  });


  useEffect(() => { 
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const countryList = data.map((country) => country.name.common);
        const sortedCountry=countryList.sort();
        setCountries(sortedCountry);
      })
      .catch((error) => {
        console.error('Error fetching countries: ', error);
      });
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Confirm password should be equal to password');
      return;
    }
    console.log(formData);
  };

  const renderStudentFields = () => {
    return (
      <>
        <label>
          College Name:
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Starting Year:
          <input
            type="text"
            name="startingYear"
            value={formData.startingYear}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Ending Year:
          <input
            type="text"
            name="endingYear"
            value={formData.endingYear}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
      </>
    );
  };

  const renderProfessionalFields = () => {
    return (
      <>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Designation:
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Job Preference:
          <select
            name="jobPreference"
            value={formData.jobPreference}
            onChange={handleInputChange}
            required
          >
            <option value="Software Developer">Software Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <br />
      </>
    );
  };

  return (




    <div className="container">
 
 

  

      <div className="form-container">
        <h2>Registration Form</h2>
        <div className="scrollable-form">
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
          Country:
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
          <br />

          <label>
            City:
            <input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
               
          </label>
          <br />

          <label>
            Are you a student or working professional?
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
            >
              <option value="student">Student</option>
              <option value="professional">Working Professional</option>
            </select>
          </label>
          <br />

          {formData.userType === 'student' && renderStudentFields()}

          {formData.userType === 'professional' && renderProfessionalFields()}

          <button type="submit">Register</button>
        </form>
        </div>
      </div>
       
    </div>
 
  );
}

export default RegistrationForm;