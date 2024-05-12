import React, { useEffect, useState } from "react";
import { ActualQueue } from "./components/ActualQueue";
import {
  faCirclePlus,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { Dashboard } from "./components/Dashboard";
import "./design/index.css";
import { Button } from "./components/Button";
import { NewProductModal } from "./components/NewProductModal";
import { AddToActualQueueModal } from "./components/AddToActualQueueModal";

const App = () => {
  const [isShowModal, setIsShowModal] = useState(null);

  useEffect(() => {
    const initLoad = async () => {
      const response = await fetch(
        "http://localhost:3001/HistoryLists/getByQuery?id=5354619859210833"
      );
      const data = await response.json();
      console.log("data: ", data);
    };
    initLoad();
  }, []);

  const openModal = (modalType) => {
    setIsShowModal(modalType);
  };

  const closeModal = () => {
    setIsShowModal(null);
  };

  return (
    <>
      <header className="main-header">
        <h1>csQUEUE</h1>
        <Button
          label="Create product"
          icon={faCirclePlus}
          addStyle={{ marginRight: "10px" }}
          onClick={() => openModal("newProduct")}
        />
        <Button
          label="Add to queue"
          icon={faClipboardList}
          onClick={() => openModal("addToQueue")}
        />
      </header>

      <div className="actual-queue">
        <ActualQueue />
      </div>

      <div className="dashboard-style">
        <Dashboard />
      </div>

      {isShowModal === "newProduct" && <NewProductModal onClose={closeModal} />}
      {isShowModal === "addToQueue" && (
        <AddToActualQueueModal onClose={closeModal} />
      )}
    </>
  );
};

export default App;
