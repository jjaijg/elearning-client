import React, { useEffect, useState } from "react";

const FileTableFilter = ({ papers, onFilterChange }) => {
  const [fileTypes, setFileTypes] = useState([]);
  const [allPapers, setAllPapers] = useState([]);

  useEffect(() => {
    if (papers.length) {
      const newPaps = [];
      const newTypes = [];
      papers.forEach((paper) => {
        newPaps.push({
          name: paper.name,
          id: paper._id,
        });

        paper.files.forEach((file) => {
          if (!newTypes.includes(file.fileType)) {
            newTypes.push(file.fileType);
          }
        });
      });
      setAllPapers(newPaps);
      setFileTypes(newTypes);
    } else {
      setFileTypes([]);
      setAllPapers([]);
      //   setFilterOptions({ paper: "", fileType: "" });
    }
  }, [papers]);

  return (
    <div className="accordion" id="file-table-filter">
      <div className="accordion-item">
        <h2 className="accordion-header" id="table-filter-heading">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFilter"
            aria-expanded="true"
            aria-controls="collapseFilter"
          >
            Filters
          </button>
        </h2>
        <div
          id="collapseFilter"
          className="accordion-collapse collapse hide"
          aria-labelledby="table-filter-heading"
          data-bs-parent="#file-table-filter"
        >
          <div className="accordion-body">
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="Papers" className="form-label">
                    Choose paper
                  </label>
                  <select
                    id="Papers"
                    name="paper"
                    className="form-select"
                    defaultValue={""}
                    onChange={onFilterChange}
                  >
                    <option disabled>---Select Papers---</option>
                    <option value="">All</option>
                    {allPapers.map((pap) => (
                      <option key={pap.id} value={pap.id}>
                        {pap.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="file-type" className="form-label">
                    Choose file type
                  </label>
                  <select
                    id="file-type"
                    name="fileType"
                    className="form-select"
                    defaultValue={""}
                    onChange={onFilterChange}
                  >
                    <option disabled>---Select file types---</option>
                    <option value="">All</option>
                    {fileTypes.map((file) => (
                      <option key={file} value={file}>
                        {file.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTableFilter;
