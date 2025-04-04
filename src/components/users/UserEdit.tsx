import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/users.services';
import { User } from '../../schema/UserSchema';
import LoadingComponent from './LoadingComponent';
import './UserEdit.css';

const UserEdit = () => {
      const { id } = useParams();
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const navigate = useNavigate();

      useEffect(() => {
            const fetchUser = async () => {
                  try {
                        const user = await UserService.getUserById(Number(id));
                        setUser(user);
                  } catch (error: any) {
                        setError(error.message || "An error occurred");
                  } finally {
                        setLoading(false);
                  }
            };
            fetchUser();
      }, [id]);

      if (loading) {
            return <LoadingComponent />;
      }

      if (error) {
            return <div className="error">{error}</div>;
      }

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setUser({ ...user, [name]: value } as User);
      };

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const updatedUser = {
                  firstName: (event.target as HTMLFormElement).firstName.value,
                  lastName: (event.target as HTMLFormElement).lastName.value,
                  email: (event.target as HTMLFormElement).email.value,
                  balance: user?.balance,
                  status: user?.status,
                  registerDate: user?.registerDate,
                  id: user?.id,
            };
            try {
                  await UserService.updateUser(Number(id), updatedUser as User);
                  alert('User updated successfully!');
                  navigate('/home');
            } catch (error: any) {
                  console.error(error);
                  alert('Failed to update user');
            }
      };

      return (
            <div className="containerUserEdit">
                  <h1 className="titleUserEdit">Edit User</h1>
                  <form onSubmit={handleSubmit} className="formUserEdit">
                        <div className="editItem">
                              <label htmlFor="firstName">First Name</label>
                              <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={user?.firstName || ''}
                                    onChange={handleChange}
                              />
                        </div>
                        <div className="editItem">
                              <label htmlFor="lastName">Last Name</label>
                              <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={user?.lastName || ''}
                                    onChange={handleChange}
                              />
                        </div>
                        <div className="editItem">
                              <label htmlFor="email">Email</label>
                              <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user?.email || ''}
                                    onChange={handleChange}
                              />
                        </div>
                        <button type="submit">Save Changes</button>
                  </form>
            </div>
      );
};

export default UserEdit;
