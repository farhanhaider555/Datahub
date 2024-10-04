import React, { useEffect, useState } from "react";

import { uploadDataApi } from "../url/url";
import axios from "axios";
import Breadcrumb from "../common/Breadcrumb";
import GrassIcon from "@mui/icons-material/Grass";
import DataTable from "react-data-table-component";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MicromirrorResource.css'


const MicromirrorResource = () => {
  const [dataList, setDataList] = useState([]);

  const fetchDataList = async () => {
    try {
      const response = await axios.get(`${uploadDataApi}/datapublicationlist`);
      setDataList(response.data.data);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filterData = dataList.filter(item => item.p_heading === 'micromatter');

  const columns = [
    {
      name: 'S.No',
      cell: (row, index) => index + 1,
      center: true
    },
    {
      name: 'Issue',
      selector: row => row.p_title,
      center: true
    },
    {
      name: 'Date',
      selector: row => formatDate(row.date),
      center: true
    },
    {
      name: 'Get report',
      cell: row => (
        <button className="get_report" onClick={() => handlePDFDownload(row.pdf_file)}>
          <i className="bi bi-eye-fill"></i> Get Report
        </button>
      ),
      center: true
    },
  ];

  const handlePDFDownload = (pdf) => {
    const pdfUrl = `https://api.mfinindia.org/public/${pdf}`;
    const viewerUrl = `https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`;
    window.open(viewerUrl, '_blank');
  }

  return (
    <div className="row container-outs">
      <div role="presentation" className="mb-4">
        <Breadcrumb
          title="MicroMatter"
          secondTitle="Publication"
          secondUrl="/datapublicationcard"
          second={true}
          icon={GrassIcon}
        />
      </div>

      <div className="col-sm-8">
        <DataTable
          columns={columns}
          data={filterData}
          pagination
        />
      </div>
      <div className="col-sm-4 align-self-center">
        {filterData.length > 0 && (
          <div className="container-in">
            <div className="top-content">
              <p>
                <button onClick={() => handlePDFDownload(filterData[0].pdf_file)}>
                  <i className="bi bi-eye-fill"></i> View Report
                </button>
              </p>
            </div>
            <div
              className="backimg"
              style={{
                backgroundImage: `url("https://api.mfinindia.org/public/${filterData[0].image}")`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                borderRadius: "10px",
              }}
            >
              <div className="dataas">
                <p>{formatDate(filterData[0].date)}</p> {/* Use formatDate for proper date format */}
              </div>
            </div>

            <div className="title">
              <p>{filterData[0].p_title}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default MicromirrorResource;