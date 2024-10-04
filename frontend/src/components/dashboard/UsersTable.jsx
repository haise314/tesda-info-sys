import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const fetchUsers = async () => {
  try {
    const response = await axios.get("/users");
    console.log("API response:", response);

    if (
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE html>")
    ) {
      throw new Error(
        "Received HTML instead of JSON. Check server configuration."
      );
    }

    if (!Array.isArray(response.data)) {
      console.error("Unexpected data format:", response.data);
      throw new Error("Received data is not an array. Check server response.");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const updateUser = async (updatedUser) => {
  const { uli, ...updateData } = updatedUser;
  await axios.put(`/api/auth/users/${uli}`, updateData);
};

const UsersTable = () => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleProcessRowUpdate = (newRow) => {
    updateUserMutation.mutate(newRow);
    return newRow;
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users: {error.message}</div>;

  // At this point, we're sure users is an array due to our error handling in fetchUsers
  const validUsers = users.filter(
    (user) => user && typeof user === "object" && user.uli
  );

  const columns = [
    { field: "uli", headerName: "ULI", width: 200, editable: false },
    { field: "role", headerName: "Role", width: 150, editable: true },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      valueGetter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "N/A",
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      valueGetter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "N/A",
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      {validUsers.length !== users.length && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          Warning: Some users were filtered out due to missing ULIs.
        </div>
      )}
      <DataGrid
        rows={validUsers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        processRowUpdate={handleProcessRowUpdate}
        getRowId={(row) => row.uli}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

export default UsersTable;
