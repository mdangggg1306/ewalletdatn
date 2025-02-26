import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

export default function Service() {
  const [data, setData] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [addingService, setAddingService] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState(null);
  const [editingserviceName, setEditingserviceName] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [addService, setaddService] = useState("");

  const getAllServices = async () => {
    try {
      const response = await axios.get("http://localhost:3002/services/");
      const resData = response.data;
      setData(resData);
    } catch (error) {
      if (error.response.status === 500) {
        console.log("khong xac dinh");
      }
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  const columns = [
    { field: "serviceName", headerName: "Dịch vụ", flex: 1, minWidth: 200 },
    {
      field: "amount",
      headerName: "Giá",
      type: "number",
      width: 120,
      align: "right",
      headerAlign: "right",
      editable: true,
    },
    {
      field: "action",
      headerName: "Tùy chỉnh",
      width: 120,
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

  const handleEditClick = (params) => {
    setEditingService(params.row);
    setEditedValue(params.row.amount);
    setEditingObjectId(params.row.objectId);
    setEditingserviceName(params.row.serviceName);
  };

  const handleSaveEdit = async () => {
    const updateData = {
      amount: editedValue,
    };
    try {
      await axios.put(
        `http://localhost:3002/services/update/${editingObjectId}`,
        updateData,
        { headers: { "Content-Type": "application/json" } }
      );
      setEditingService(null);
      getAllServices();
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error);
    }
  };

  const handleAddClick = () => {
    setAddingService(true);
    setEditingserviceName("");
    setEditedValue("");
  };

  const handleSaveAdd = async () => {
    const form = {
      serviceName: addService,
      amount: editedValue,
    };
    try {
      await axios.post("http://localhost:3002/services/create", form, {
        headers: { "Content-Type": "application/json" },
      });
      setAddingService(false);
      getAllServices();
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);
    }
  };

  const handleCloseDialog = () => {
    setEditingService(null);
    setAddingService(false);
  };

  const handleDeleteClick = async (objectId) => {
    try {
      await axios.delete(`http://localhost:3002/services/delete/${objectId}`);
      getAllServices();
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  return (
    <div style={styles.container}>
      <Typography variant="h4" style={styles.title}>
        Quản lý Dịch vụ
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        style={styles.addButton}
      >
        Thêm dịch vụ
      </Button>

      <Dialog open={!!editingService} onClose={handleCloseDialog}>
        <DialogTitle>Cập nhật giá</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" style={styles.dialogContent}>
            {editingserviceName}
          </Typography>
          <TextField
            label="Giá"
            type="number"
            fullWidth
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addingService} onClose={handleCloseDialog}>
        <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Dịch vụ"
            fullWidth
            value={addService}
            onChange={(e) => setaddService(e.target.value)}
            style={styles.dialogInput}
          />
          <TextField
            label="Giá"
            type="number"
            fullWidth
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            style={styles.dialogInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleSaveAdd} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={styles.dataGridContainer}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.objectId}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          style={styles.dataGrid}
        />
      </Box>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "2rem auto",
    display: "flex",
    flexDirection: "column",
    background: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "1.5rem",
    color: "#333",
  },
  addButton: {
    alignSelf: "flex-start",
    marginBottom: "1.5rem",
    backgroundColor: "#1976d2",
  },
  dataGridContainer: {
    height: 450,
    width: "100%",
    "& .actions": {
      color: "text.secondary",
    },
    "& .textPrimary": {
      color: "text.primary",
    },
  },
  dataGrid: {
    border: "none",
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #f0f0f0",
      padding: "16px",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#f8f9fa",
      borderBottom: "2px solid #e0e0e0",
      color: "#333",
      fontWeight: "bold",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  dialogContent: {
    fontSize: "1.2rem",
    paddingBottom: "20px",
    color: "#333",
  },
  dialogInput: {
    marginBottom: "20px",
  },
};
