import axios from "axios";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import DepartmentModal from "./DepartmentModal";

const DepartmentBoard = ({ departments, loading, setProcessed }) => {
  const [selectedDept, setSelectedDept] = useState(null);

  const deptRef = useRef(null);

  const onAdd = () => {
    if (!deptRef.current.value) return;
    console.log(deptRef.current.value);
    const newDeptName = deptRef.current.value;
    axios
      .post(`${process.env.RAZZLE_API_URL}/departments`, {
        name: newDeptName,
      })
      .then((res) => {
        setProcessed(true);
        toast.success(`${res.data.name} added successfully!`);
      });
  };

  const onEdit = (dept) => {
    setSelectedDept(dept);
    console.log(dept);
  };

  const onUpdate = (updatedDept) => {
    const { id, name } = updatedDept;
    axios
      .put(`${process.env.RAZZLE_API_URL}/departments/${id}`, {
        name,
      })
      .then(() => {
        setProcessed(true);
        toast.success(`updated successfully!`);
      });
  };

  const onDelete = (deptId) => {
    const canDel = window.confirm("Are you sure?");
    if (canDel) {
      axios
        .delete(`${process.env.RAZZLE_API_URL}/departments/${deptId}`)
        .then((res) => {
          setProcessed(true);
          toast.success(res.data.message);
        });
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Departments</h4>
          <div className="row my-3">
            <div className="col-8">
              <input
                type="text"
                className="form-control"
                placeholder="Department name"
                aria-label="Department name"
                ref={deptRef}
              />
            </div>
            <div className="col-4">
              <button className="btn btn-success" onClick={onAdd}>
                Add Department
              </button>
            </div>
          </div>
          {/* <button
            className="btn btn-primary my-2"
            data-bs-toggle="modal"
            data-bs-target="#departmentModal"
          >
            Add Department
          </button> */}
          <DepartmentModal department={selectedDept} submitHandler={onUpdate} />

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col"># Sem</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, ind) => (
                  <tr key={dept._id}>
                    <td scope="col">{ind + 1}</td>
                    <td scope="col">{dept.name}</td>
                    <td scope="col">{dept.semesters.length}</td>
                    <td scope="col">
                      <div className="d-flex flex-row space-around">
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#departmentModal"
                          className="btn btn-outline-info btn-sm mx-2"
                          role={"button"}
                          onClick={() => onEdit(dept)}
                        >
                          <i className="bi bi-pen"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm mx-2"
                          role={"button"}
                          onClick={() => onDelete(dept._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <Skeleton count={10} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentBoard;
