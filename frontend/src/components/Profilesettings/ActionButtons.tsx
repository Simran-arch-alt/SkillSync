
import { Box, Button } from '@mui/material';

// 1. Define the explicit type contract for the props
interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
}

// 2. Destructure and type the props in the component definition
const ActionButtons = ({ onCancel, onSave }: ActionButtonsProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 2, 
        mt: 4, 
        pt: 2, 
        borderTop: '1px solid #E2E8F0' 
      }}
    >
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          color: '#64748B',
          borderColor: '#CBD5E1',
          px: 3,
          py: 1,
          borderRadius: 2,
          '&:hover': {
            borderColor: '#94A3B8',
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        Cancel
      </Button>
      
      <Button
        variant="contained"
        onClick={onSave}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          bgcolor: '#14B8A6',
          color: '#FFFFFF',
          px: 3,
          py: 1,
          borderRadius: 2,
          '&:hover': {
            bgcolor: '#0D9488',
          },
        }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default ActionButtons;