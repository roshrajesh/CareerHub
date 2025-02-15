import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import avatar from './avatar.png'

axios.defaults.baseURL = 'http://localhost:5001'; // Backend URL

const JobStatusPage = () => {
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
              <h1>My Applications</h1>
            </div>

            <div style={styles.tableData}>
            
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Full Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Message</th>
                    <th style={styles.th}>Aptitude Link</th>
                    <th style={styles.th}>Interview Link</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={styles.noData}>No applications found.</td>
                    </tr>
                  ) : (
                    applications.map((application) => (
                      <tr key={application._id}>
                        <td style={styles.td}>{application.fullName}</td>
                        <td style={styles.td}>{application.email}</td>
                        <td style={styles.td}>{application.message}</td>
                        <td style={styles.td}>
                          {application.aptitudeLink ? (
                            <a href={application.aptitudeLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
                              Aptitude Test Link
                            </a>
                          ) : (
                            'Not Available'
                          )}
                        </td>
                        <td style={styles.td}>
                          {application.interviewLink ? (
                            <a href={application.interviewLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
                              Interview Link
                            </a>
                          ) : (
                            'Not Available'
                          )}
                        </td>
                        <td style={styles.td}>{application.isApproved ? 'Approved' : 'Pending'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
  },
  buttonHover: {
    backgroundColor: '#2980b9',
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
  tableData: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    overflowX: 'auto',
    display: 'flex',
    justifyContent: 'center',  // Centers the table
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px auto',  // Centers the table
    maxWidth: '1000px',
  },
  th: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  noData: {
    textAlign: 'center',
    padding: '12px',
    color: '#2c3e50',
  },
  link: {
    textDecoration: 'none',
    color: '#3498db',
    fontWeight: 'bold',
  },
  linkHover: {
    textDecoration: 'underline',
  },
};

export default JobStatusPage;
