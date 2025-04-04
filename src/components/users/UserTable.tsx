import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/users.services';
import { User } from '../../schema/UserSchema';
import LoadingComponent from './LoadingComponent';
import './UserTable.css';
import { FixedSizeList as List } from 'react-window';
import { ThemeContext } from '../../providers/ThemeContext';
// Định nghĩa props cho UserRow
interface UserRowProps {
      index: number;
      style: React.CSSProperties;
      data: {
            users: User[];
            selectedUsers: number[];
            handleSelect: (id: number, checked: boolean) => void;
            formatBalance: (balance: number) => string;
            formatRegisterDate: (registerDate: string) => { displayDate: string; detailedDate: string };
            handleDelete: (id: number) => void;
      };
}

// Component UserRow để render từng hàng
const UserRow: React.FC<UserRowProps> = ({ index, style, data }) => {
      const user = data.users[index];
      const { displayDate, detailedDate } = data.formatRegisterDate(user.registerDate);
      return (
            <div style={style} className="userRow">
                  <div className="userItem">
                        <input
                              type="checkbox"
                              checked={data.selectedUsers.includes(user.id)}
                              onChange={(e) => data.handleSelect(user.id, e.target.checked)}
                        />
                        {user.firstName} {user.lastName}
                  </div>
                  <div className="userItem">{user.email}</div>
                  <div className="userItem">
                        <span className="statusUserItem">{user.status}</span>
                  </div>
                  <div className="userItem">{data.formatBalance(user.balance)}</div>
                  <div className="userItem" title={detailedDate}>
                        {displayDate}
                  </div>
                  <div className="userItem">
                        <Link className="button editButton" to={`/users/${user.id}`}>
                              Edit
                        </Link>
                        <button className="button deleteButton" onClick={() => data.handleDelete(user.id)}>
                              Delete
                        </button>
                  </div>
            </div>
      );
};

const UserTable = () => {
      const [users, setUsers] = useState<User[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
      const [totalUsers, setTotalUsers] = useState<number>(0);
      const [currentPage, setCurrentPage] = useState<number>(1);
      const [totalPages, setTotalPages] = useState<number>(1);
      const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
      const [sortBy, setSortBy] = useState<keyof User | ''>('');
      const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
      const [search, setSearch] = useState('');
      const { darkMode, toggleDarkMode } = useContext(ThemeContext);
      const fetchUsers = async (page: number) => {
            setLoading(true);
            setError(null);
            try {
                  const response = await UserService.getUsers(page, 10, search, sortBy, sortOrder);
                  if (response.status === 200) {
                        setUsers(response.data);
                        setTotalUsers(response.totalUsers);
                        setTotalPages(response.totalPages);
                        setCurrentPage(page);
                        setSelectedUsers([]);
                  } else {
                        setError('Failed to fetch users');
                  }
            } catch (err: any) {
                  setError(err.message || 'An error occurred while fetching users');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchUsers(currentPage);
      }, [search, sortBy, sortOrder]);

      const formatBalance = (balance: number) => {
            return balance.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
            });
      };

      const formatRegisterDate = (registerDate: string) => {
            const date = new Date(registerDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const displayDate = `${year}-${month}-${day}`;
            const detailedDate = date.toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
            });
            return { displayDate, detailedDate };
      };

      const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                  setSelectedUsers(users.map((user) => user.id));
            } else {
                  setSelectedUsers([]);
            }
      };

      const handleSelect = (id: number, checked: boolean) => {
            if (checked) {
                  setSelectedUsers((prev) => [...prev, id]);
            } else {
                  setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
            }
      };

      const handlePageChange = (page: number) => {
            if (page >= 1 && page <= totalPages) {
                  fetchUsers(page);
            }
      };

      const handleDelete = async (id: number) => {
            if (!confirm('Are you sure you want to delete this user?')) {
                  return;
            }
            try {
                  const response = await UserService.deleteUser(id);
                  if (response.status === 200) {
                        alert('User deleted successfully');
                        fetchUsers(currentPage);
                  } else {
                        alert('Failed to delete user');
                  }
            } catch (err: any) {
                  console.error(err);
                  setError(err.message || 'An error occurred while deleting user');
            }
      };

      const handleDeleteMany = async () => {
            if (!confirm('Are you sure you want to delete these users?')) {
                  return;
            }
            if (selectedUsers.length === 0) {
                  alert('Please select at least one user');
                  return;
            }
            try {
                  const response = await UserService.deleteManyUsers(selectedUsers);
                  if (response.status === 200) {
                        alert('Users deleted successfully');
                        fetchUsers(currentPage);
                  } else {
                        alert('Failed to delete users');
                  }
            } catch (err: any) {
                  console.error(err);
                  setError(err.message || 'An error occurred while deleting users');
            }
      };

      return (
            <div className="containerUserTable">
                  <button className='button toggleDarkMode' onClick={toggleDarkMode}>{darkMode ? 'Dark Mode' : 'Light Mode'}</button>
                  <h1 className="titleUserTable">User Table</h1>
                  <div className="controlsUserTable">
                        <input
                              type="text"
                              placeholder="Search by name or email..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="searchInput"
                        />
                        <select onChange={(e) => setSortBy(e.target.value as keyof User)} value={sortBy} className="sortSelect">
                              <option value="">Sort by</option>
                              <option value="firstName">First Name</option>
                              <option value="lastName">Last Name</option>
                              <option value="email">Email</option>
                              <option value="balance">Balance</option>
                              <option value="registerDate">Register Date</option>
                        </select>
                        <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} value={sortOrder} className="sortSelect">
                              <option value="asc">Asc</option>
                              <option value="desc">Desc</option>
                        </select>
                        <button className='button deleteAllButton' onClick={handleDeleteMany}>Delete Selected</button>
                  </div>

                  {!loading && !error && users.length > 0 ? (
                        <>
                              <div className="tableHeader">
                                    <div className="headerItem">
                                          <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedUsers.length === users.length && users.length > 0}
                                          />
                                          Name
                                    </div>
                                    <div className="headerItem">Email</div>
                                    <div className="headerItem">Status</div>
                                    <div className="headerItem">Balance</div>
                                    <div className="headerItem">Register Date</div>
                                    <div className="headerItem">Action</div>
                              </div>
                              <List
                                    height={1400} // Chiều cao của danh sách
                                    itemCount={users.length} // Số lượng người dùng
                                    itemSize={120} // Chiều cao mỗi hàng
                                    width="100%" // Chiều rộng của danh sách
                                    itemData={{
                                          users,
                                          selectedUsers,
                                          handleSelect,
                                          formatBalance,
                                          formatRegisterDate,
                                          handleDelete,
                                    }}
                              >
                                    {UserRow}
                              </List>
                              <div className="paginationUserTable">
                                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                                          Previous
                                    </button>
                                    <span>Page {currentPage} of {totalPages}</span>
                                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                                          Next
                                    </button>
                              </div>
                        </>
                  ) : (
                        <>
                              {loading && <LoadingComponent />}
                              {error && <div style={{ color: 'red' }}>{error}</div>}
                        </>
                  )}
                  <div className="totalUsersTable">
                        <p>Total Users: {totalUsers}</p>
                  </div>
            </div>
      );
};

export default UserTable;