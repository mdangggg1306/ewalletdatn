import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Home() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getAllhistory = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/history/`);
      const resData = response.data;
      setData2(resData);
    } catch (error) {
      if (error.response.status === 500) {
        console.log("khong xac dinh");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllhistory();
      await getAllTransactions();
      setLoading(false);
    };
    fetchData();
  }, []);

  const processDataForChart = () => {
    const monthlyData = Array.from({ length: 12 }, () => 0);

    data.forEach((transaction) => {
      const createTime = new Date(transaction.createTime.seconds * 1000);
      transaction.amount = transaction.amount / 1000000;
      const month = createTime.getMonth();
      monthlyData[month] += parseInt(transaction.amount, 10);
    });

    return {
      xAxis: [{ data: Array.from({ length: 12 }, (_, i) => i + 1) }],
      series: [{ data: monthlyData }],
    };
  };

  const processDataForChart2 = () => {
    const monthlyData2 = Array.from({ length: 12 }, () => 0);

    data2.forEach((transaction2) => {
      const createTime = new Date(transaction2.Timestamp.seconds * 1000);
      transaction2.amount = transaction2.amount / 1000;
      const month = createTime.getMonth();
      monthlyData2[month] += parseInt(transaction2.amount, 10);
    });

    return {
      xAxis: [{ data: Array.from({ length: 12 }, (_, i) => i + 1) }],
      series: [{ data: monthlyData2 }],
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Thống kê</h1>
      <div style={styles.chartsContainer}>
        <div style={styles.chartWrapper}>
          <h2 style={styles.chartTitle}>
            Số giao dịch đã thực hiện: {data.length}
          </h2>
          {data.length > 0 && (
            <LineChart {...processDataForChart()} width={500} height={300} />
          )}
          <div style={styles.chartLabel}>Giao dịch (đơn vị: triệu)</div>
        </div>
        <div style={styles.chartWrapper}>
          <h2 style={styles.chartTitle}>
            Số hoạt động đã thực hiện: {data2.length}
          </h2>
          {data2.length > 0 && (
            <LineChart {...processDataForChart2()} width={500} height={300} />
          )}
          <div style={styles.chartLabel}>Hoạt động (đơn vị: nghìn)</div>
        </div>
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
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  chartsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  chartWrapper: {
    margin: "20px 0",
    textAlign: "center",
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#555",
  },
  chartLabel: {
    fontSize: "14px",
    color: "#777",
    marginTop: "10px",
  },
};
