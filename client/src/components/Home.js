import React, { useState, useEffect } from "react";
import { useAuth } from "../use-auth";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

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
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { rating, remarks } = event.target;
    try {
      const response = await axios.post("/feedback", {
        licenseId: dialogInfo.licenseId,
        rating: (rating.value - 3) * 5,
        remarks: remarks.value
      });
      setAlert({
        severity: "info",
        message: "Feedback Sent Succesfully"
      });
      setAlert({
        severity: null,
        message: null
      });
      setHover(-1);
      setValue(3);
      onClose();
    } catch (err) {
      setAlert({
        severity: "error",
        message: err.response.data.message
      });
    }
    onClose();
  };

  return (
    <Dialog
      open={dialogInfo.open}
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
        {alert.message && (
          <Alert severity={alert.severity}>{alert.message}</Alert>
        )}
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

export default function Home() {
  const [licenses, setLicenses] = useState([]);
  const { user } = useAuth();
  const [dialogInfo, setDialogInfo] = useState({
    open: false
  });

  const handleFeedbackDialogOpen = (params) => {
    setDialogInfo({
      ...dialogInfo,
      open: true,
      licenseId: params.row.licenseId,
      shopKeeperName: params.row.fullName,
      shopName: params.row.shopName
    });
  };
  const handleFeedbackDialogClose = () => {
    setDialogInfo({
      ...dialogInfo,
      open: false,
      licenseId: null
    });
  };

  const columns = [
    {
      field: "licenseId",
      headerName: "License Id",
      flex: 0.5,
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
      flex: 1,
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
      flex: 1,
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
  }

  if (user && user.userRole === "SHOPKEEPER") {
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
  }

  useEffect(() => {
    async function fetchLicenses() {
      try {
        const response = await axios.get("/license/all");
        setLicenses(response.data);
      } catch (err) {
        console.log("[fetchLicensesError] = ", err);
      }
    }
    fetchLicenses();
  }, []);

  return user && licenses ? (
    <div style={{ height: "80vh", width: "100%" }}>
      <FeedbackDialog
        dialogInfo={dialogInfo}
        onClose={handleFeedbackDialogClose}
      />
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
