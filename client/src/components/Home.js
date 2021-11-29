import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../use-auth";
import { DataGrid } from "@mui/x-data-grid";

import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slide,
  TextField,
  Grid,
  Typography,
  Rating
} from "@mui/material";

import {
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
  SentimentVerySatisfied as SentimentVerySatisfiedIcon
} from "@mui/icons-material";

import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils";
import axios from "../axios";

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon fontSize="large" />,
    label: "Very Dissatisfied"
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize="large" />,
    label: "Dissatisfied"
  },
  3: {
    icon: <SentimentSatisfiedIcon fontSize="large" />,
    label: "Neutral"
  },
  4: {
    icon: <SentimentSatisfiedAltIcon fontSize="large" />,
    label: "Satisfied"
  },
  5: {
    icon: <SentimentVerySatisfiedIcon fontSize="large" />,
    label: "Very Satisfied"
  }
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function FeedbackDialog({ dialogInfo, onClose }) {
  const [value, setValue] = useState(3);
  const [hover, setHover] = useState(-1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { rating, remarks } = event.target;
    try {
      const response = await axios.post("/feedback", {
        licenseId: dialogInfo.licenseId,
        rating: (rating.value - 3) * 5,
        remarks: remarks.value
      });
      toast.success(response.data.message, toastOptions);
    } catch (err) {
      toast.error(err.response.data.message, toastOptions);
    }
  };

  return (
    <Dialog
      open={dialogInfo.open === "Feedback"}
      onClose={onClose}
      maxWidth="lg"
      fullWidth={true}
      TransitionComponent={Transition}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "2em"
        }}
      >
        Feedback
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          alignItems="center"
          sx={{
            marginBottom: 1
          }}
        >
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: "light",
                fontSize: "1.75em",
                marginRight: 3,
                textAlign: "center"
              }}
            >
              {dialogInfo.shopKeeperName}@<u>{dialogInfo.shopName}</u>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={6}
                  sx={{
                    textAlign: "right"
                  }}
                >
                  <Rating
                    value={value}
                    IconContainerComponent={IconContainer}
                    highlightSelectedOnly
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    sx={{
                      textAlign: "center"
                    }}
                    name="rating"
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{
                    // textAlign: "left",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  {value !== null && (
                    <Typography sx={{ fontSize: "large" }}>
                      {customIcons[hover !== -1 ? hover : value].label}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <TextField
                label="Remarks"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                name="remarks"
              />
              <Button fullWidth variant="contained" type="submit">
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function ExtendLicense({ dialogInfo, onClose }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const endDate = event.target.endDate.value;
    try {
      const response = await axios.post("/license/extend", {
        licenseId: dialogInfo.licenseId,
        endDate
      });
      toast.success(response.data.message, toastOptions);
    } catch (err) {
      toast.error(err.response.data.message, toastOptions);
    }
  };

  return (
    <Dialog
      open={dialogInfo.open === "License"}
      onClose={onClose}
      maxWidth="lg"
      fullWidth={true}
      TransitionComponent={Transition}
    >
      <DialogTitle>Extend License</DialogTitle>
      <Typography
        sx={{
          fontWeight: "light",
          fontSize: "1.75em",
          marginRight: 3,
          textAlign: "center"
        }}
      >
        {dialogInfo.shopKeeperName}@<u>{dialogInfo.shopName}</u>
      </Typography>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <label htmlFor="licenseEndDate">New End Date: </label>
              <input type="date" id="licenseEndDate" name="endDate" />
            </Grid>

            <Grid item xs={5}>
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button onClick={onClose} variant="contained" fullWidth>
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [dialogInfo, setDialogInfo] = useState({
    open: false
  });
  const { state } = useLocation();

  const handleFeedbackDialogOpen = (params) => {
    setDialogInfo({
      ...dialogInfo,
      open: "Feedback",
      licenseId: params.row.licenseId,
      shopKeeperName: params.row.fullName,
      shopName: params.row.shopName
    });
  };
  const handleFeedbackDialogClose = async () => {
    await fetchLicenses();
    setDialogInfo({
      open: false
    });
  };
  const handleLicenseDialogOpen = (params) => {
    setDialogInfo({
      open: "License",
      shopKeeperUserId: params.row.shopKeeperUserId,
      licenseId: params.row.licenseId,
      shopKeeperName: params.row.fullName,
      shopName: params.row.shopName
    });
  };

  const columns = [
    {
      field: "licenseId",
      headerName: "License Id",
      flex: 0.25,
      type: "number"
    },
    {
      field: "fullName",
      headerName: "Shop Keeper",
      flex: 1,
      type: "string"
    },
    {
      field: "shopName",
      headerName: "Shop",
      flex: 1
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 0.5,
      type: "dateTime",
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 0.5,
      type: "dateTime",
      valueFormatter: ({ value }) =>
        new Date(value).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
    }
  ];

  if (user && user.userRole === "CUSTOMER") {
    columns.push({
      field: "",
      headerName: "Feedback",
      renderCell: (params) => (
        <Button
          onClick={() => handleFeedbackDialogOpen(params)}
          variant="contained"
        >
          Report
        </Button>
      )
    });
  } else if (user && user.userRole === "SHOPKEEPER") {
    columns.push({
      field: "rentPerMonth",
      headerName: "Rent / Month",
      flex: 1,
      valueFormatter: (params) =>
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR"
        }).format(params.value)
    });
  } else if (user && user.userRole === "ADMIN") {
    columns.push({
      field: "",
      headerName: "Extend License",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          onClick={() => handleLicenseDialogOpen(params)}
          variant="contained"
        >
          Extend
        </Button>
      )
    });
  }

  const fetchLicenses = async () => {
    try {
      const response = await axios.get("/license/all");
      setLicenses(response.data);
    } catch (err) {
      toast.error("Error Fetching Licenses", toastOptions);
    }
  };

  useEffect(() => {
    if (state && state.showAlert)
      toast.success("Logged in successfully!", toastOptions);

    if (user) fetchLicenses();
  }, []);

  console.log(user);

  return user && licenses ? (
    <div style={{ height: "80vh", width: "100%" }}>
      <FeedbackDialog
        dialogInfo={dialogInfo}
        onClose={handleFeedbackDialogClose}
      />
      <ExtendLicense
        dialogInfo={dialogInfo}
        onClose={handleFeedbackDialogClose}
      />
      <ToastContainer />
      {user.userRole === "SHOPKEEPER" &&
        user.gatepass &&
        Math.abs(new Date() - new Date(user.gatepass.endDate)) /
          (1000 * 60 * 60 * 24) <=
          30 && (
          <Alert severity="info" sx={{ marginBottom: 2 }}>
            Your gatepass is expiring in{" "}
            {Math.ceil(
              Math.abs(new Date() - new Date(user.gatepass.endDate)) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days!
          </Alert>
        )}
      <DataGrid
        getRowId={(row) => row.licenseId}
        rows={licenses}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[10]}
      />
    </div>
  ) : (
    <h1>Home Page</h1>
  );
}
