import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apipaths';
import SelectDropdown from './SelectDropdown'; // Adjust path if needed

const SelectUsers = ({ selectedUser, setSelectedUser }) => {
    const [allUsers, setAllUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response.data?.length > 0) {
                const options = response.data.map((user) => ({
                    value: user._id,
                    label: user.email,
                }));
                setAllUsers(options);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            <SelectDropdown
                options={allUsers}
                value={selectedUser}
                onChange={setSelectedUser}
                placeholder="Select a user"
            />
        </div>
    );
};

export default SelectUsers;
