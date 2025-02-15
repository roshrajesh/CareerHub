import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import avatar from './avatar.png'
import "./profile.css"
axios.defaults.baseURL = 'http://localhost:5001'; // Backend URL

const ProfilePage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userResponse = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          firstname: userResponse.data.firstname,
          email: userResponse.data.email,
          avatar: userResponse.data.avatar || 'avatar.png',
        });

        const applicationsResponse = await axios.get(
          `/api/applications?userID=${userResponse.data.userID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(
          (applicationsResponse.data.applications || []).filter(
            (app) => app.email === userResponse.data.email
          )
        );
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
     <div style={styles.sidebar}>
  <button style={styles.button} onClick={() => navigate('/student')}>
    Dashboard
  </button>
  <button style={{ ...styles.button, marginTop: '10px' }} onClick={() => navigate('/pro')}>
    Projects
  </button>
</div>

      

      <div style={styles.mainContent}>
        {user && (
          <div style={styles.profileSection}>
            <div style={styles.profileContent}>
              <img src={avatar} alt="Avatar" style={styles.profileAvatar} />
              <div>
                <h1>Welcome, {user.firstname}!</h1>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <section>
          <main>
            <div style={styles.headTitle}>
              <h1>My Profile </h1>
            </div>
            {applications.length === 0 ? (
              <p style={styles.noData}>No applications found.</p>
            ) : (
              applications.map((application) => (
                <div key={application._id} style={styles.profileCard}>
                  <p><strong>Full Name:</strong> {application.fullName}</p>
                  <p><strong>Email:</strong> {application.email}</p>
                  <p><strong>Phone:</strong> {application.phone}</p>
                  <p><strong>DOB:</strong> {application.dob}</p>
                  <p><strong>Gender:</strong> {application.gender}</p>
                  <p><strong>Address:</strong> {application.address}</p>
                  <p><strong>City:</strong> {application.city}</p>
                  <p><strong>State:</strong> {application.state}</p>
                  <p><strong>Qualification:</strong> {application.highestQualification}</p>
                  <p><strong>Skills:</strong> {application.skills}</p>
                  <p><strong>Resume:</strong> <a href={application.resume} target="_blank" rel="noopener noreferrer">View</a></p>
                  <p><strong>LinkedIn:</strong> <a href={application.linkedIn} target="_blank" rel="noopener noreferrer">Profile</a></p>
                </div>
              ))
            )}
          </main>
        </section>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f4f9',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
    marginBottom: '10px', 
  },
  mainContent: {
    flexGrow: 1,
    padding: '30px',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  profileContent: {
    display: 'flex',
    alignItems: 'center',
  },
  profileAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '15px',
    border: '3px solid #3498db',
  },
  headTitle: {
    margin: '20px 0',
    fontSize: '24px',
    color: '#2c3e50',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  noData: {
    textAlign: 'center',
    padding: '12px',
    color: '#2c3e50',
  },
};

export default ProfilePage;
