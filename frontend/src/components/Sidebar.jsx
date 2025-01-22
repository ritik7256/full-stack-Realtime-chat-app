import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import useAuthStore from "../store/useAuthStore";
const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  console.log("users is: ", users);

  if (isUsersLoading) return <SidebarSkeleton />;
  if (users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <aside className="h-full w-20 md:w-72 border-r border-base-300 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 p-4">
        <Users className="h-6 w-6" />
        <span className="font-medium hidden md:block">Contacts</span>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3 flex flex-col">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`p-3 flex items-center gap-3 rounded hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            {/* User Profile Picture */}
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullname || "User Avatar"}
              className="h-12 w-12 object-cover rounded-full"
            />

            {/* User Info */}
            {onlineUsers.includes(user._id) && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
            )}
            <div className="hidden md:block text-left min-w-0">
              <div className="font-medium truncate">
                {user.fullname || "Unknown User"}
              </div>
              <div className="text-sm text-zinc-400 truncate">{user.email}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
