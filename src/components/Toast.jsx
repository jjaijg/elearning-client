import React, { useEffect, useRef } from "react";
const Toast = ({ status, message }) => {
  const toast = useRef(null);
  useEffect(() => {
    if (toast.current) toast.current;
  }, [status]);
  console.log("toasted");
  return (
    <div
      ref={toast}
      className={`toast align-items-center text-white bg-${
        status || "primary"
      } border-0`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Toast;
