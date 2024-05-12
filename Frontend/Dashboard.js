import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import "../design/Dashboard.css";

export const Dashboard = () => {
  const [historyData, setHistoryData] = useState([]);
  const [selectedProductName, setSelectedProductName] =
    useState("Všechny položky");
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyResponse = await axios.get(
          "http://localhost:3001/HistoryLists/getByQuery"
        );
        setHistoryData(historyResponse.data.data);
      } catch (error) {
        console.error("Chyba při načítání dat: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProductName === "Všechny položky") {
      const aggregatedData = aggregateDataAllProducts(historyData);
      setFilteredHistoryData(aggregatedData);
    } else {
      const aggregatedData = aggregateDataSelectedProduct(
        historyData,
        selectedProductName
      );
      setFilteredHistoryData(aggregatedData);
    }
  }, [selectedProductName, historyData]);

  const productOptions = [
    "Všechny položky",
    ...new Set(historyData.map((item) => item.name)),
  ];

  const handleProductChange = (event) => {
    setSelectedProductName(event.target.value);
  };

  const aggregateDataAllProducts = (data) => {
    const aggregatedData = {};
    data.forEach((item) => {
      const key = item.creationDate;
      if (aggregatedData[key]) {
        aggregatedData[key].quantity += parseFloat(item.quantity);
      } else {
        aggregatedData[key] = { ...item };
        aggregatedData[key].quantity = parseFloat(item.quantity);
      }
    });
    return Object.values(aggregatedData);
  };

  const aggregateDataSelectedProduct = (data, selectedProduct) => {
    const aggregatedData = {};
    data.forEach((item) => {
      if (item.name === selectedProduct) {
        const key = `${item.name}_${item.creationDate}`;
        if (aggregatedData[key]) {
          aggregatedData[key].quantity += parseFloat(item.quantity);
        } else {
          aggregatedData[key] = { ...item };
          aggregatedData[key].quantity = parseFloat(item.quantity);
        }
      }
    });
    return Object.values(aggregatedData);
  };

  const options = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        },
      },
    },
    xaxis: {
      categories: filteredHistoryData.map((item) => item.creationDate),
    },
    stroke: {
      curve: "smooth",
    },
  };

  const series = [
    {
      name: "Quantity",
      data: filteredHistoryData.map((item) => item.quantity),
    },
  ];

  return (
    <div>
      <h1>Dashboard</h1>

      <select value={selectedProductName} onChange={handleProductChange}>
        {productOptions.map((productName, index) => (
          <option key={index} value={productName}>
            {productName}
          </option>
        ))}
      </select>

      <h2>Historická data</h2>
      <div className="graph-container">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};
