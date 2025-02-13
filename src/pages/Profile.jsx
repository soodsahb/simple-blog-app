
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton
  } from '@mui/material';
  import { 
    Email as EmailIcon,
    Person as PersonIcon,
    CalendarMonth as CalendarIcon,
    ArrowBack as ArrowBackIcon
  } from '@mui/icons-material';
  import { useAuth } from '../context/AuthContext';
  import { useNavigate } from 'react-router-dom';
  
  const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
  
    return (
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            mt: 4,
            position: 'relative' // Added for absolute positioning of back button
          }}
        >
          {/* Back Button */}
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              position: 'absolute',
              left: 16,
              top: 16,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
  
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                mb: 2
              }}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ fontWeight: 700 }}
            >
              {user.username}
            </Typography>
          </Box>
  
          <Divider sx={{ my: 3 }} />
  
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Username"
                secondary={user.username}
              />
            </ListItem>
  
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={user.email}
              />
            </ListItem>
  
            <ListItem>
              <ListItemIcon>
                <CalendarIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Member Since"
                secondary={new Date().toLocaleDateString()}
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    );
  };
  
  export default Profile;
  