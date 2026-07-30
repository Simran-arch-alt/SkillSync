import { useState, useEffect } from 'react';
import {
  Avatar, Box, Chip, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import CardContainer from '../Common/CardContainer';
import { getAllUsers } from '../../services/adminService';

const RecentUsers = () => {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { users } = await getAllUsers(1, 5);
        setRecentUsers(users || []);
      } catch {
        console.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <CardContainer><Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box></CardContainer>;
  }

  return (
    <CardContainer>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: "#0F172A" }}>Recently Registered Users</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentUsers.map((user: any) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#119DA4" }}>{user.name?.charAt(0) || '?'}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.university || user.degree || 'Student'}</TableCell>
                <TableCell><Chip label="Active" color="success" size="small" /></TableCell>
              </TableRow>
            ))}
            {recentUsers.length === 0 && (
              <TableRow><TableCell colSpan={3} align="center"><Typography color="text.secondary">No users yet</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContainer>
  );
};

export default RecentUsers;
