import React, { useState } from "react";
import "../design/NewProductModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFloppyDisk,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";

export const NewProductModal = ({ onClose }) => {
  const [formState, setFormState] = useState({});

  const handleChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveProduct = async () => {
    if (
      !Object.keys(formState).length ||
      Object.values(formState).every((el) => el === "")
    ) {
      alert("Musíte vyplnit formulář");
      return false;
    }
    const response = await fetch("http://localhost:3001/createProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });
    if (response.ok) {
      console.log("Product successfully saved.");
      onClose(false);
    } else {
      console.log("Failed to save product.");
    }
    const data = await response.json();
    console.log("data returned: ", data);
  };

  console.log("formState: ", formState);
  return (
    <aside className="product-modal-aside">
      <FontAwesomeIcon
        className="close-btn"
        icon={faXmark}
        onClick={() => onClose(false)}
      />
      <form>
        <h3>Přidat nový produkt</h3>
        <div>
          <label>name</label>
          <input
            type="text"
            onChange={(val) => handleChange("name", val.target.value)}
          />
        </div>
        <div>
          <label>eanCode</label>
          <input
            type="text"
            onChange={(val) => handleChange("eanCode", val.target.value)}
          />
        </div>
        <div>
          <label>size</label>
          <input
            type="text"
            onChange={(val) => handleChange("size", val.target.value)}
          />
        </div>
        <div>
          <label>expUnit</label>
          <input
            type="number"
            onChange={(val) => handleChange("expUnit", val.target.value)}
          />
        </div>
        <div>
          <label>price</label>
          <input
            type="number"
            onChange={(val) => handleChange("price", val.target.value)}
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
          onClick={saveProduct}
        />
      </div>
    </aside>
  );
};
