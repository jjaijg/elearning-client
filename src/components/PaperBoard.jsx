import React, { useState } from "react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FileUploader } from "react-drag-drop-files";
// import { getCssId } from "css-unique-id";
import uniqid from "uniqid";
import { CircularProgressbar } from "react-circular-progressbar";

import PaperModal from "./PaperModal";
import paperService from "../services/paper.service";

const MAX_SIZE = process.env.RAZZLE_MAX_FILE_SIZE_IN_MB || 100;
const TYPES = process.env.RAZZLE_SUPPORTED_TYPES
  ? process.env.RAZZLE_SUPPORTED_TYPES.split(",")
  : [];

console.log("file type : ", process.env.RAZZLE_SUPPORTED_TYPES);
const PaperBoard = ({
  papers,
  departments,
  semesters,
  loading,
  setProcessed,
}) => {
  const [selectedPap, setSelectedPap] = useState(null);
  const [addForm, setAddForm] = useState({
    add_name: "",
    add_dept: "",
    add_sem: "",
  });
  const [uploadForm, setUploadForm] = useState({
    upl_dept: "",
    upl_sem: "",
    upl_pap: "",
    upl_file: null,
  });
  const [activeTab, setActiveTab] = useState("add-paper");
  const [progress, setProgress] = useState(0);

  const canFileUpload =
    !uploadForm.upl_dept ||
    !uploadForm.upl_sem ||
    !uploadForm.upl_pap ||
    !uploadForm.upl_file ||
    progress;

  const onAddChange = (e) => {
    const { name, value } = e.target;
    if (name === "add_dept")
      setAddForm({ ...addForm, [name]: value, add_sem: "" });
    else setAddForm({ ...addForm, [name]: value });
  };

  const onAdd = async () => {
    if (!addForm.add_dept || !addForm.add_sem || !addForm.add_name) return;

    try {
      const newPap = {
        name: addForm.add_name,
        department: addForm.add_dept,
        semester: addForm.add_sem,
      };
      const paper = await paperService.addPaper(newPap);
      setProcessed(true);
      toast.success(`${paper.name} added successfully!`);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onEdit = (pap) => {
    setSelectedPap(pap);
    console.log(pap);
  };

  const onUpdate = async (updatedPap) => {
    try {
      const { id, name } = updatedPap;
      await paperService.updPaper(id, name);
      setProcessed(true);
      toast.success(`updated successfully!`);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onDelete = async (papId) => {
    const canDel = window.confirm("Are you sure?");
    try {
      if (canDel) {
        const res = await paperService.delPaper(papId);
        setProcessed(true);
        toast.success(res.message);
      }
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onUploadChange = (e) => {
    const { name, value } = e.target;
    if (name === "upl_dept")
      setUploadForm({ ...uploadForm, [name]: value, upl_sem: "", upl_pap: "" });
    else if (name === "upl_sem")
      setUploadForm({ ...uploadForm, [name]: value, upl_pap: "" });
    else setUploadForm({ ...uploadForm, [name]: value });
  };

  const getFile = (file) => {
    setUploadForm({ ...uploadForm, upl_file: file });
  };

  const handleFileTypeError = (err) => {
    setUploadForm({ ...uploadForm, upl_file: null });
    console.log(err);
    toast.error(`${err} - File type should be ${TYPES.join("/")}`);
  };
  const handleFileSizeError = (err) => {
    setUploadForm({ ...uploadForm, upl_file: null });
    toast.error(`${err} - should be less than ${MAX_SIZE} mb`);
  };

  const onUploadProgress = (progressEvent) => {
    var percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(percentCompleted);
  };

  const onUpload = async () => {
    if (canFileUpload) return;
    try {
      const res = await paperService.uplFile(
        uploadForm.upl_pap,
        uploadForm.upl_file,
        onUploadProgress
      );
      setProcessed(true);
      setUploadForm({ ...uploadForm, upl_file: null });
      setProgress(0);
      toast.success(`${res.message}`);
    } catch (err) {
      console.log("err : ", err);
      setProgress(0);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const onFileDelete = async (papId, file) => {
    const canDel = window.confirm("Are you sure?");
    try {
      if (canDel) {
        const res = await paperService.delFile(papId, file);
        setProcessed(true);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const addFilteredSem = addForm.add_dept
    ? semesters.filter((sem) => sem.department._id === addForm.add_dept)
    : [];

  const uplFilteredSem = uploadForm.upl_dept
    ? semesters.filter((sem) => sem.department._id === uploadForm.upl_dept)
    : [];

  const uplFilteredPap = uploadForm.upl_sem
    ? papers.filter((pap) => pap.semester._id === uploadForm.upl_sem)
    : [];

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Papers</h4>
          <div className="container">
            <ul className="nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => setActiveTab("add-paper")}
              >
                <span
                  className={`${
                    activeTab === "add-paper" ? "active" : ""
                  } nav-link`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#add-paper"
                  aria-expanded="false"
                  aria-controls="add-paper"
                >
                  Add Paper
                </span>
              </li>
              <li
                className="nav-item"
                onClick={() => setActiveTab("upload-file")}
              >
                <span
                  className={`${
                    activeTab === "upload-file" ? "active" : ""
                  } nav-link`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#upload-file"
                  aria-expanded="false"
                  aria-controls="upload-file"
                >
                  Upload File
                </span>
              </li>
            </ul>
            <div className="tab-content">
              <div
                className={`tab-pane fade ${
                  activeTab === "add-paper" ? "show active" : ""
                }`}
                id="add-paper"
              >
                <div className="row my-3">
                  <div className="col-sm-12 col-8">
                    <select
                      className="form-select mb-3"
                      aria-label="Department list"
                      placeholder="Select department"
                      required
                      name="add_dept"
                      value={addForm.add_dept}
                      onChange={onAddChange}
                    >
                      <option value="" disabled>
                        --Choose Department--
                      </option>
                      {departments?.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="form-select mb-3"
                      placeholder="Semester name"
                      aria-label="Semester name"
                      required
                      name="add_sem"
                      value={addForm.add_sem}
                      onChange={onAddChange}
                      disabled={!addForm.add_dept || !addFilteredSem.length}
                    >
                      <option value="" disabled>
                        {addForm.add_dept && !addFilteredSem.length
                          ? "No semester found"
                          : "--Choose semester--"}
                      </option>
                      {addFilteredSem.map((sem) => (
                        <option key={sem._id} value={sem._id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Paper name"
                      aria-label="Paper name"
                      name="add_name"
                      value={addForm.add_name}
                      onChange={onAddChange}
                      required
                    />
                  </div>
                  <div className="col-sm-12 col-8">
                    <button
                      className="btn btn-success"
                      onClick={onAdd}
                      disabled={
                        !addForm.add_dept ||
                        !addForm.add_sem ||
                        !addForm.add_name
                      }
                    >
                      Add Paper
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "upload-file" ? "show active" : ""
                }`}
                id="upload-file"
              >
                <div className="row my-3">
                  <div className="col-sm-12 col-8">
                    <select
                      className="form-select mb-3"
                      aria-label="Department list"
                      placeholder="Select department"
                      required
                      name="upl_dept"
                      value={uploadForm.upl_dept}
                      onChange={onUploadChange}
                      disabled={!departments?.length}
                    >
                      <option disabled value={""}>
                        Choose department
                      </option>
                      {departments?.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="form-select mb-3"
                      placeholder="Semester name"
                      aria-label="Semester name"
                      required
                      name="upl_sem"
                      value={uploadForm.upl_sem}
                      onChange={onUploadChange}
                      disabled={!uploadForm.upl_dept || !uplFilteredSem?.length}
                    >
                      <option value="" disabled>
                        {uploadForm.upl_dept && !uplFilteredSem?.length
                          ? "No semester found"
                          : "--Choose semester--"}
                      </option>
                      {uplFilteredSem.map((sem) => (
                        <option key={sem._id} value={sem._id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="form-select mb-3"
                      aria-label="Paper list"
                      placeholder="Select paper"
                      required
                      name="upl_pap"
                      value={uploadForm.upl_pap}
                      onChange={onUploadChange}
                      disabled={!uploadForm.upl_sem || !uplFilteredPap?.length}
                    >
                      <option value="" disabled>
                        {uploadForm.upl_sem && !uplFilteredPap?.length
                          ? "No paper found"
                          : "--Choose paper--"}
                      </option>
                      {uplFilteredPap.map((pap) => (
                        <option key={pap._id} value={pap._id}>
                          {pap.name}
                        </option>
                      ))}
                    </select>
                    <div className="my-3 row">
                      <div className="col-6">
                        <FileUploader
                          handleChange={getFile}
                          onSelect={getFile}
                          onDrop={getFile}
                          onTypeError={handleFileTypeError}
                          onSizeError={handleFileSizeError}
                          name="file"
                          types={TYPES}
                          maxSize={MAX_SIZE}
                          fileOrFiles={uploadForm.upl_file}
                        />
                      </div>
                      {progress > 0 && (
                        <div
                          className="col-1"
                          style={{ width: 75, height: 75 }}
                        >
                          <CircularProgressbar
                            value={progress}
                            maxValue={100}
                            text={`${progress}%`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-8">
                    <button
                      className="btn btn-success"
                      onClick={onUpload}
                      disabled={canFileUpload}
                    >
                      Add file to paper
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PaperModal paper={selectedPap} submitHandler={onUpdate} />

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Semester</th>
                  <th scope="col">Department</th>
                  <th scope="col"># files</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((pap, ind) => {
                  const cssId = uniqid("e-", "-learning");

                  return (
                    <React.Fragment key={pap._id}>
                      <tr>
                        <td scope="col">{ind + 1}</td>
                        <td scope="col">{pap.name}</td>
                        <td scope="col">{pap.semester.name}</td>
                        <td scope="col">{pap.semester.department.name}</td>
                        <td scope="col">{pap.files.length}</td>
                        <td scope="col">
                          <div className="d-flex flex-row space-around">
                            <button
                              className="btn btn-outline-primary btn-sm mx-2"
                              role={"button"}
                              data-bs-toggle="collapse"
                              data-bs-target={`#${cssId}`}
                              aria-expanded="false"
                              aria-controls={`${cssId}`}
                            >
                              <i className="bi bi-toggles"></i>
                            </button>
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#paperModal"
                              className="btn btn-outline-info btn-sm mx-2"
                              role={"button"}
                              onClick={() => onEdit(pap)}
                            >
                              <i className="bi bi-pen"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm mx-2"
                              role={"button"}
                              onClick={() => onDelete(pap._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="collapse m-2" id={`${cssId}`}>
                        <td scope="col" colSpan={"6"}>
                          <table className="table table-info table-stripped table-hover">
                            <thead>
                              <tr>
                                <th scope="col">Document</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pap.files.map((file) => (
                                <tr key={`${pap.name}-${file.fileName}}`}>
                                  <td>
                                    <div className="d-flex flex-row align-items-center">
                                      <div style={{ width: "26px" }}>
                                        <FileIcon
                                          extension={file.fileType}
                                          {...defaultStyles[file.fileType]}
                                        />
                                      </div>

                                      <span className="px-1">
                                        {file.fileName}
                                      </span>
                                    </div>
                                  </td>
                                  {/* <td>{paper.name}</td> */}
                                  {/* <td>{selectedPap.name}</td> */}
                                  {/* <td>{selectedDept.name}</td> */}
                                  <td>
                                    <button
                                      className="btn btn-outline-danger btn-sm mx-2"
                                      role={"button"}
                                      onClick={() =>
                                        onFileDelete(pap._id, file)
                                      }
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {loading && <Skeleton count={10} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaperBoard;
