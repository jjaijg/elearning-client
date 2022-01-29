import React, { useEffect, useState } from "react";

const SemesterModal = ({ semester, departments, submitHandler }) => {
  const [semName, setSemName] = useState("");
  const [department, setDepartment] = useState("");
  useEffect(() => {
    if (semester) {
      setSemName(semester.name);
      setDepartment(semester.department._id);
    }
  }, [semester]);

  const shouldUpdate =
    (semName && semName !== semester?.name) ||
    (department && department !== semester?.department._id);

  return (
    <div
      className="modal fade"
      id="semesterModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="semester-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="semester-modal-label">
              Edit Semester
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
                  Semester Id
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="_id"
                  placeholder="Semester Id"
                  defaultValue={semester?._id}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Semester name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Semester name"
                  value={semName}
                  onChange={(e) => setSemName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <select
                  type="text"
                  className="form-select"
                  id="department"
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments?.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
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
                submitHandler({ id: semester._id, name: semName, department })
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

export default SemesterModal;
