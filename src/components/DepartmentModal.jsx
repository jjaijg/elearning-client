import React, { useEffect, useState } from "react";

const DepartmentModal = ({ department, submitHandler }) => {
  const [deptName, setDeptName] = useState("");
  useEffect(() => {
    if (department) {
      setDeptName(department.name);
    }
  }, [department]);

  const shouldUpdate = deptName && deptName !== department?.name;

  return (
    <div
      className="modal fade"
      id="departmentModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="department-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="department-modal-label">
              Edit Department
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
                  Department Id
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="_id"
                  placeholder="Department Id"
                  defaultValue={department?._id}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Department name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Department name"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
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
              onClick={() =>
                submitHandler({ id: department._id, name: deptName })
              }
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

export default DepartmentModal;
