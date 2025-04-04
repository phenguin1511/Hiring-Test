import axios from "axios";
import { User } from "../schema/UserSchema";

interface GetUsersResponse {
      users: Omit<User, 'balance' | 'status'>[];
      total: number;
      skip: number;
      limit: number;
}

const getRandomBalance = () => {
      return Math.floor(Math.random() * 9900 + 100);
};

const getRandomRegisterDate = () => {
      const currentDate = new Date();
      const randomDate = new Date(currentDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30);
      return randomDate.toISOString();
};

class UserService {
      async getUsers(
            page: number = 1,
            limit: number = 10,
            searchQuery: string = '',
            sortBy: keyof User | '' = '',
            sortOrder: 'asc' | 'desc' = 'asc'
      ) {
            const response = await axios.get<GetUsersResponse>(
                  `https://dummyjson.com/users?limit=100`
            );
            const data = response.data;
            let usersWithExtras: User[] = data.users.map((user) => ({
                  ...user,
                  balance: getRandomBalance(),
                  status: "STATUS",
                  registerDate: getRandomRegisterDate(),
            }));

            if (searchQuery) {
                  usersWithExtras = usersWithExtras.filter((user) =>
                        `${user.firstName} ${user.lastName} ${user.email}`
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                  );
            }

            if (sortBy) {
                  usersWithExtras.sort((a, b) => {
                        const aValue = a[sortBy];
                        const bValue = b[sortBy];
                        if (aValue === undefined || bValue === undefined) return 0;
                        return sortOrder === 'asc'
                              ? String(aValue).localeCompare(String(bValue))
                              : String(bValue).localeCompare(String(aValue));
                  });
            }

            const totalUsers = usersWithExtras.length;
            const totalPages = Math.ceil(totalUsers / limit);
            const paginatedUsers = usersWithExtras.slice((page - 1) * limit, page * limit);

            return {
                  data: paginatedUsers,
                  totalUsers,
                  status: response.status,
                  message: response.statusText,
                  currentPage: page,
                  totalPages,
            };
      }



      async getUserById(id: number) {
            const response = await axios.get<User>(`https://dummyjson.com/users/${id}`);
            if (response.status === 200) {
                  return response.data;
            } else {
                  throw new Error("User not found");
            }
      }

      async updateUser(id: number, user: User) {
            const response = await axios.put(`https://dummyjson.com/users/${id}`, user);
            console.log(response);
            if (response.status === 200) {
                  return response.data;
            } else {
                  throw new Error("User not found");
            }
      }

      async deleteUser(id: number) {
            const response = await axios.delete(`https://dummyjson.com/users/${id}`);

            if (response.status === 200) {
                  return {
                        status: response.status,
                        message: response.statusText,
                        response: response.data,
                  };
            } else {
                  throw new Error("User not found");
            }
      }

      async deleteManyUsers(ids: number[]) {
            const response = await Promise.all(ids.map(id => this.deleteUser(id)));
            if (response.every(r => r.status === 200)) {
                  return {
                        status: 200,
                        message: "Users deleted successfully",
                        response: response,
                  };
            } else {
                  throw new Error("Users not found");
            }
      }

}

export default new UserService();
