"use client";

import "./customModal.css"; // Import centralized modal styles

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title,
  message,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button-gold" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

interface CustomInputModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  onSubmit: (inputValue: string) => void;
  onCancel: () => void;
  inputValue: string; // Added inputValue property
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInputModal: React.FC<CustomInputModalProps> = ({
  visible,
  title,
  placeholder,
  onSubmit,
  onCancel,
  inputValue,
  onInputChange,
}) => {
  if (!visible) return null;

  const handleSubmit = () => {
    onSubmit(inputValue); // Pass the current input value to the onSubmit handler
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <input
          type="text"
          value={inputValue} // Controlled input value
          onChange={onInputChange} // Call the parent-provided onInputChange handler
          placeholder={placeholder}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button className="modal-button-red" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-button-green" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};