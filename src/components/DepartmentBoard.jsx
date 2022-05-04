import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import DepartmentModal from "./DepartmentModal";
import departmentService from "../services/department.service";

const DepartmentBoard = ({ departments, loading, setProcessed }) => {
  const [selectedDept, setSelectedDept] = useState(null);

  const deptRef = useRef(null);

  const onAdd = async () => {
    if (!deptRef.current.value) return;
    // console.log(deptRef.current.value);
    const newDeptName = deptRef.current.value;
    try {
      const dept = await departmentService.addDept(newDeptName);
      setProcessed(true);
      toast.success(`${dept.name} added successfully!`);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onEdit = (dept) => {
    setSelectedDept(dept);
    console.log(dept);
  };

  const onUpdate = async (updatedDept) => {
    const { id, name } = updatedDept;
    try {
      await departmentService.updDept(id, name);
      setProcessed(true);
      toast.success(`updated successfully!`);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onDelete = async (deptId) => {
    const canDel = window.confirm("Are you sure?");
    try {
      if (canDel) {
        const res = await departmentService.delDept(deptId);
        setProcessed(true);
        toast.success(res.message);
      }
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Courses</h4>
          <div className="row my-3">
            <div className="col-8">
              <input
                type="text"
                className="form-control"
                placeholder="Course name"
                aria-label="Course name"
                ref={deptRef}
              />
            </div>
            <div className="col-4">
              <button className="btn btn-success" onClick={onAdd}>
                Add Course
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
