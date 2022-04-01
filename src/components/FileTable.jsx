import React, { useState, useEffect } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { CircularProgressbar } from "react-circular-progressbar";

import FileTableFilter from "./FileTableFilter";

const FileTable = ({
  papers,
  selectedDept,
  selectedSem,
  downloadFile,
  downloadProgress = 0,
}) => {
  const [filterOptions, setFilterOptions] = useState({
    paper: "",
    fileType: "",
  });

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    });
  };

  const filteredPapers = !filterOptions.paper
    ? papers
    : papers.filter((paper) => paper._id === filterOptions.paper);

  return (
    <div className="card shadow p-3 mb-5 bg-white rounded">
      <div className="card-body">
        <h4 className="row card-title">
          <div className="col-sm-4 col-lg-2">E-Documents</div>
          {downloadProgress > 0 && (
            <div className="col-3 col-lg-1" style={{ width: 75, height: 75 }}>
              <CircularProgressbar
                value={downloadProgress}
                maxValue={100}
                text={`${downloadProgress}%`}
              />
            </div>
          )}
        </h4>
        {!selectedDept || !selectedSem ? (
          <div className="alert alert-info" role="alert">
            Choose both department and semester to get documents
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <FileTableFilter
                papers={papers}
                onFilterChange={onFilterChange}
              />
            </div>
            <div className="col-12 my-3">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Document</th>
                      <th scope="col">Paper</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPapers?.length ? (
                      filteredPapers.map((paper) =>
                        paper.files
                          .filter((file) =>
                            filterOptions.fileType
                              ? file.fileType === filterOptions.fileType
                              : file.fileType
                          )
                          .map((file) => (
                            <tr key={file.fileName}>
                              <td>
                                <div className="d-flex flex-row align-items-center">
                                  <div style={{ width: "26px" }}>
                                    <FileIcon
                                      extension={file.fileType}
                                      {...defaultStyles[file.fileType]}
                                    />
                                  </div>

                                  <span className="px-1">{file.fileName}</span>
                                </div>
                              </td>
                              <td>{paper.name}</td>
                              {/* <td>{selectedSem.name}</td> */}
                              {/* <td>{selectedDept.name}</td> */}
                              <td>
                                <button
                                  className="btn btn-success"
                                  onClick={() => downloadFile(file)}
                                  disabled={downloadProgress}
                                >
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))
                      )
                    ) : (
                      <tr className="bg-info">
                        <td colSpan={5} className="text-center">
                          No Data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTable;
