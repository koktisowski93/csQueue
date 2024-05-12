import React, { useState, useEffect } from "react";
import "../design/AddToActualQueueModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFloppyDisk,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";

export const AddToActualQueueModal = ({ onClose, updateQueue }) => {
  const [formState, setFormState] = useState({
    name: "",
    eanCode: "",
    quantity: "",
  });
  const [products, setProducts] = useState([]);
  const [eanCodeMap, setEanCodeMap] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/getProductsByQuery"
        );
        const data = await response.json();
        if (data.state) {
          const uniqueProducts = Array.from(
            new Set(data.data.map((product) => product.name))
          );
          const sortedProducts = uniqueProducts.sort();
          setProducts(sortedProducts);

          const eanCodeMap = {};
          data.data.forEach((product) => {
            eanCodeMap[product.name] = product.eanCode;
          });
          setEanCodeMap(eanCodeMap);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProductSelection = (event) => {
    const selectedProductName = event.target.value;
    const selectedProduct = products.find(
      (product) => product === selectedProductName
    );
    if (selectedProduct) {
      setFormState((prevState) => ({
        ...prevState,
        name: selectedProduct,
        eanCode: eanCodeMap[selectedProduct] || "",
      }));
    }
  };

  const addProductToQueue = async () => {
    if (!formState.name || !formState.eanCode || !formState.quantity) {
      alert("Musíte vyplnit formulář");
      return false;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const completeData = {
      ...formState,
      creationDate: formattedDate,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/waitingList/pushItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeData),
        }
      );
      const data = await response.json();
      console.log("data returned: ", data);

      updateQueue();
      onClose(false);
    } catch (error) {
      console.error("Failed to add product to queue:", error);
    }
  };

  return (
    <aside className="product-modal-aside">
      <FontAwesomeIcon
        className="close-btn"
        icon={faXmark}
        onClick={() => onClose(false)}
      />
      <form>
        <h3>Přidat do aktuální Queue</h3>
        <div>
          <label>Název produktu</label>
          <select onChange={handleProductSelection} value={formState.name}>
            <option value="">Vyberte produkt</option>
            {products.map((productName, index) => (
              <option key={index} value={productName}>
                {productName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>EAN kód</label>
          <input
            type="text"
            value={formState.eanCode}
            onChange={(val) => handleChange("eanCode", val.target.value)}
          />
        </div>
        <div>
          <label>Množství</label>
          <input
            type="text"
            value={formState.quantity}
            onChange={(val) => handleChange("quantity", val.target.value)}
          />
        </div>
      </form>
      <div className="handle-buttons">
        <Button
          label="Zavřít"
          icon={faCircleXmark}
          addStyle={{ marginRight: "10px" }}
          onClick={() => onClose(false)}
        />
        <Button
          label="Uložit"
          icon={faFloppyDisk}
          addStyle={{ marginRight: "10px" }}
          onClick={addProductToQueue}
        />
      </div>
    </aside>
  );
};
