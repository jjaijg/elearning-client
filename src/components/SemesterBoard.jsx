import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import SemesterModal from "./SemesterModal";
import semesterService from "../services/semester.service";

const SemesterBoard = ({ departments, semesters, loading, setProcessed }) => {
  const [selectedSem, setSelectedSem] = useState(null);

  const semRef = useRef(null);
  const deptRef = useRef(null);

  const onAdd = async () => {
    if (!semRef.current.value || !deptRef.current.value) return;
    // console.log(deptRef.current.value);
    try {
      const newSem = {
        name: semRef.current.value,
        department: deptRef.current.value,
      };
      const sem = await semesterService.addSem(newSem);
      setProcessed(true);
      toast.success(`${sem.name} added successfully!`);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onEdit = (sem) => {
    setSelectedSem(sem);
    console.log(sem);
  };

  const onUpdate = async (updatedSem) => {
    const { id, name, department } = updatedSem;
    try {
      await semesterService.updSem(id, name);
      setProcessed(true);
      toast.success(`updated successfully!`);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onDelete = async (semId) => {
    const canDel = window.confirm("Are you sure?");
    try {
      if (canDel) {
        const res = await semesterService.delSem(semId);
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
          <h4 className="card-title">Semesters</h4>
          <div className="row my-3">
            <div className="col-sm-12 col-7lg-8">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Semester name"
                aria-label="Semester name"
                ref={semRef}
                required
              />
              <select
                className="form-select mb-3"
                aria-label="Course list"
                placeholder="Select course"
                required
                ref={deptRef}
                defaultValue={""}
              >
                <option value="" disabled>
                  {!departments.length
                    ? "No course found"
                    : "--Choose course--"}
                </option>
                {departments?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-12 col-lg-8 ">
              <button className="btn btn-success" onClick={onAdd}>
                Add Semester
              </button>
            </div>
          </div>

          <SemesterModal
            semester={selectedSem}
            departments={departments}
            submitHandler={onUpdate}
          />

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Course</th>
                  <th scope="col"># Paper</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map((sem, ind) => (
                  <tr key={sem._id}>
                    <td scope="col">{ind + 1}</td>
                    <td scope="col">{sem.name}</td>
                    <td scope="col">{sem.department.name}</td>
                    <td scope="col">{sem.papers.length}</td>
                    <td scope="col">
                      <div className="d-flex flex-row space-around">
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#semesterModal"
                          className="btn btn-outline-info btn-sm mx-2"
                          role={"button"}
                          onClick={() => onEdit(sem)}
                        >
                          <i className="bi bi-pen"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm mx-2"
                          role={"button"}
                          onClick={() => onDelete(sem._id)}
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

export default SemesterBoard;
