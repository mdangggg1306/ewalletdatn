import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

export default function Userlist() {
  const [data, setData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingObjectId, setEditingObjectId] = useState(null);
  const [editingusername, setEditingusername] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3002/users/");
      const resData = response.data;
      resData.forEach((data, index) => {
        data.id = index + 1;
      });
      setData(resData);
    } catch (error) {
      if (error.response.status === 500) {
        console.log("khong xac dinh");
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDeleteClick = async (objectId) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/users/update/${objectId}`,
        {
          active: false,
        }
      );
      if (response.status === 200) {
        getAllUsers(); // Refresh the user list
      } else {
        console.error("Failed to update user:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  const handleEditClick = (params) => {
    setEditingUser(params.row);
    setEditedValue(params.row.tuition);
    setEditingObjectId(params.row.objectId);
    setEditingusername(params.row.username);
  };

  const handleSaveEdit = async () => {
    const updateData = {
      tuition: editedValue,
    };

    try {
      await axios.put(
        `http://localhost:3002/users/update/${editingObjectId}`,
        updateData,
        { headers: { "Content-Type": "application/json" } }
      );
      setEditingUser(null);
      getAllUsers(); // Refresh the user list
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  const columns = [
    { field: "username", headerName: "Họ và tên", width: 200 },
    { field: "userId", headerName: "Mã sinh viên", width: 200 },
    { field: "cardID", headerName: "Thẻ thanh toán", width: 200 },
    { field: "balance", headerName: "Số dư", width: 200, type: "number" },
    { field: "tuition", headerName: "Học phí", width: 150, type: "number" },
    {
      field: "action",
      headerName: "Tùy chỉnh",
      width: 150,
      renderCell: (params) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(params)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row.objectId)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Danh sách sinh viên</h1>
      <div style={styles.dataGridContainer}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          style={styles.dataGrid}
        />
      </div>
      {editingUser && (
        <Dialog open={true} onClose={() => setEditingUser(null)}>
          <DialogTitle>Cập nhập học phí</DialogTitle>
          <DialogContent>
            <div style={styles.dialogContent}>{editingusername}</div>
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              style={styles.dialogInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingUser(null)} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

const styles = {
  container: {
    borderRadius: "10px",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "1.5em",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
  },
  dataGridContainer: {
    height: "400px",
    width: "100%",
  },
  dataGrid: {
    border: "none",
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #f0f0f0",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#f8f9fa",
      borderBottom: "2px solid #e0e0e0",
    },
  },
  dialogContent: {
    fontSize: "1.2rem",
    paddingBottom: "20px",
  },
  dialogInput: {
    width: "100%",
    padding: "10px",
    fontSize: "1em",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
};
