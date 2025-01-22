import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios"
import useAuthStore from "./useAuthStore";
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            const data = res.data;
            set({ users: data });

        } catch (error) {
            toast.error(error.response?.data?.messages || "An error occurred");

        } finally {
            set({ isUsersLoading: false });

        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: false });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
            toast.success("message is sent succesfully")
        } catch (error) {
            toast.error(error.response.data.message);

        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        //todo:optimize this later


        socket.on("newMessage", (newMessage) => {

            if (newMessage.senderId !== selectedUser._id) return
            set({ messages: [...get().messages, newMessage] })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },


    setSelectedUser: (selectedUser) => set({ selectedUser })

}))