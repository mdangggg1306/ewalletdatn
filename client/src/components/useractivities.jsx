import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { DateTime } from "luxon";

const columns = [
  { field: "userId", headerName: "Người dùng", width: 250 },
  { field: "type", headerName: "Dịch vụ", width: 120 },
  {
    field: "amount",
    headerName: "Số tiền",
    type: "number",
    headerAlign: "left",
    align: "left",
    width: 150,
  },
  {
    field: "Timestamp",
    headerName: "Thời gian thực hiện",
    width: 250,
    type: "date",
    valueGetter: (params) => {
      const timestamp = params.row.Timestamp.seconds;
      const date = new Date(timestamp * 1000);
      return date;
    },
    renderCell: (params) => {
      const formattedDate = params.value.toLocaleString();
      return formattedDate;
    },
  },
];

export default function UserActivities() {
  const [data, setData] = useState([]);
  const userdata = useSelector((state) => state.userdata);

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/history/${userdata.userId}`
        );
        const resData = response.data;
        console.log("Fetched data:", resData);
        setData(resData);
      } catch (error) {
        if (error.response.status === 500) {
          console.log("khong xac dinh");
        }
      }
    };
    getAllTransactions();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lịch sử hoạt động</h1>
      <div style={styles.dataGridContainer}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.objectId}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
            sorting: {
              ...data.initialState?.sorting,
              sortModel: [
                {
                  field: "createTime",
                  sort: "desc",
                },
              ],
            },
          }}
          pageSizeOptions={[5, 10]}
          style={styles.dataGrid}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    borderRadius: "10px",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
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
      backgroundColor: "#f8f8f8",
      borderBottom: "2px solid #ddd",
    },
  },
};
