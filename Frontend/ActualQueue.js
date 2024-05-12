import React, { useState, useEffect } from "react";
import "../design/ActualQueue.css";
import { Button } from "./Button";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const ActualQueue = () => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/waitingList/get"
        );
        console.log("ActualQueue response: ", response.data);
        if (response.data.state) {
          setQueue(response.data.data);
        }
      } catch (error) {
        console.error("Chyba při načítání dat: ", error);
      }
    };

    loadData();
  }, []);

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/waitingList/export"
      );
      console.log(response.data);
    } catch (error) {
      console.error("Chyba při exportu: ", error);
    }
  };

  const summarizeQueue = () => {
    const summarizedQueue = queue.reduce((accumulator, currentItem) => {
      const existingItem = accumulator.find(
        (item) => item.name === currentItem.name
      );
      const quantity = parseInt(currentItem.quantity);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        accumulator.push({ ...currentItem, quantity });
      }
      return accumulator;
    }, []);

    return summarizedQueue;
  };

  return (
    <section className="actual-queue-section">
      <div className="top-heading">
        <h2>Aktuální QUEUE</h2>
        <Button
          label="Export"
          icon={faFileExport}
          addStyle={{ marginLeft: "1em" }}
          onClick={handleExport}
        />
      </div>

      <table>
        <tbody>
          {summarizeQueue().map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
