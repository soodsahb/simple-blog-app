
import { 
    Container, 
    Paper, 
    Typography, 
    Box,
    Link as MuiLink 
  } from '@mui/material';
  import { Link } from 'react-router-dom';
  import RegisterForm from '../components/auth/RegisterForm';
  
  const Register = () => {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Create Account
            </Typography>
            <RegisterForm />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <MuiLink component={Link} to="/login">
                Already have an account? Log In
              </MuiLink>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  };
  
  export default Register;
  