import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "createID", headerName: "Người gửi", width: 250 },
  { field: "receiveID", headerName: "Người nhận", width: 150 },
  { field: "type", headerName: "Loại giao dịch", width: 120 },
  {
    field: "createTime",
    headerName: "Ngày thực hiện",
    width: 200,
    type: "date",
    valueGetter: (params) => {
      const timestamp = params.row.createTime.seconds;
      const date = new Date(timestamp * 1000);
      return date;
    },
    renderCell: (params) => {
      const formattedDate = params.value.toLocaleString();
      return formattedDate;
    },
  },
  {
    field: "amount",
    headerName: "Số tiền",
    type: "number",
    width: 150,

    align: "right",
  },
];

export default function Transactionlist() {
  const [data, setData] = useState([]);
  const userdata = useSelector((state) => state.userdata);

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3002/transactions/");
        const resData = response.data;
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
      <h1 style={styles.header}>Lịch sử giao dịch</h1>
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
              sortModel: [{ field: "createTime", sort: "desc" }],
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
};
