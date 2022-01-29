import React, { useEffect, useState } from "react";

const PaperModal = ({ paper, submitHandler }) => {
  const [papName, setPaperName] = useState("");
  useEffect(() => {
    if (paper) {
      setPaperName(paper.name);
    }
  }, [paper]);

  const shouldUpdate = papName && papName !== paper?.name;

  return (
    <div
      className="modal fade"
      id="paperModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="paper-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="paper-modal-label">
              Edit Paper
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="_id" className="form-label">
                  Paper Id
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="_id"
                  placeholder="Paper Id"
                  defaultValue={paper?._id}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Paper name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Paper name"
                  value={papName}
                  onChange={(e) => setPaperName(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => submitHandler({ id: paper._id, name: papName })}
              disabled={!shouldUpdate}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperModal;
