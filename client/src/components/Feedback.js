import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

import {
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import axios from "../axios";
import { toastOptions } from "../utils";

export default function Feedback() {
  const [groupBy, setGroupBy] = useState("Shop");
  const [feedbacks, setFeedbacks] = useState([]);

  const handleChange = (event) => {
    setGroupBy(event.target.value);
  };

  const columns = {
    Shop: [
      {
        field: "shopId",
        headerName: "Shop Id",
        type: "number",
        flex: 0.5
      },
      {
        field: "shopName",
        headerName: "Shop Name",
        flex: 1
      },
      {
        field: "count",
        headerName: "Number of feedbacks",
        flex: 0.5,
        type: "number"
      },
      {
        field: "rating",
        headerName: "Rating",
        flex: 1,
        type: "number"
      }
    ],
    "Shop Keeper": [
      {
        field: "shopKeeperUserId",
        headerName: "ShopKeeper Id",
        type: "number",
        flex: 0.5
      },
      {
        field: "fullName",
        headerName: "ShopKeeper Name",
        flex: 1
      },
      {
        field: "count",
        headerName: "Number of feedbacks",
        flex: 0.5,
        type: "number"
      },
      {
        field: "rating",
        headerName: "Rating",
        flex: 1,
        type: "number"
      }
    ],
    "List All": [
      {
        field: "shopName",
        headerName: "Shop Name",
        flex: 1
      },
      {
        field: "shopKeeperName",
        headerName: "ShopKeeper Name",
        flex: 1
      },
      {
        field: "rating",
        headerName: "Rating",
        flex: 1,
        type: "number"
      },
      {
        field: "remarks",
        headerName: "Remarks",
        flex: 2
        // type: "number"
      }
    ]
  };

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await axios.get(`/feedback/${groupBy}`);
        console.log(response);
        setFeedbacks(response.data);
      } catch (err) {
        toast.error("Error Fetching Feedbacks", toastOptions);
      }
    }
    fetchFeedbacks();
  }, [groupBy]);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ToastContainer />
      <h1>Feedbacks</h1>
      <Box>
        <Typography>Group By</Typography>
        <RadioGroup
          row
          name="groupBy"
          defaultValue="Shop"
          onChange={handleChange}
        >
          <FormControlLabel value="Shop" control={<Radio />} label="Shop" />
          <FormControlLabel
            value="Shop Keeper"
            control={<Radio />}
            label="Shop Keeper"
          />
          <FormControlLabel
            value="List All"
            control={<Radio />}
            label="List All"
          />
        </RadioGroup>
      </Box>
      <DataGrid
        getRowId={(row) => row.id}
        rows={feedbacks}
        columns={columns[groupBy]}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
}
