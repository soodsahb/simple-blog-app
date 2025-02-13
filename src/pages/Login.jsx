
import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Link as MuiLink 
} from '@mui/material';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Log In
          </Typography>
          <LoginForm />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={Link} to="/register">
              Don't have an account? Sign Up
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
