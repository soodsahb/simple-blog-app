
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.createPost(formData);
      toast.success('Post created successfully!');
      navigate('/'); // Redirect to home page
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          mt: 4 
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 4,
            textAlign: 'center'
          }}
        >
          Create New Post
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            autoFocus
            variant="outlined"
            placeholder="Enter your post title"
            inputProps={{ maxLength: 100 }}
            helperText={`${formData.title.length}/100 characters`}
          />

          <TextField
            name="content"
            label="Content"
            value={formData.content}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Write your post content here..."
            inputProps={{ maxLength: 5000 }}
            helperText={`${formData.content.length}/5000 characters`}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            endIcon={<SendIcon />}
            sx={{ 
              mt: 2,
              py: 1.5,
              fontWeight: 600
            }}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
