import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../axios";
import { useAuth } from "../use-auth";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function PaymentDialog({ dialogInfo, onClose }) {
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting: ", dialogInfo);
    try {
      const response = await axios.get(`payment/pay/${dialogInfo.paymentId}`);
      setAlert({
        severity: "success",
        message: response.data.message
      });
    } catch (err) {
      setAlert({
        severity: "danger",
        message: err.response.data.message
      });
    }
  };

  return (
    <Dialog
      open={dialogInfo.open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth={true}
      TransitionComponent={Transition}
    >
      <DialogTitle>Payment</DialogTitle>
      <DialogContent>
        {alert.message && (
          <Alert severity={alert.severity}>{alert.message}</Alert>
        )}
        <Typography>
          <b>Shop:</b> {dialogInfo.shopName}
        </Typography>
        <Typography>
          <b>Payment Type:</b> {dialogInfo.paymentType}
        </Typography>
        <Typography>
          <b>Amount:</b> {dialogInfo.amount}
        </Typography>
        <Typography>
          <b>Penalty:</b> {dialogInfo.penalty}
        </Typography>
        <Typography>
          <b>Due Date:</b> {dialogInfo.dueDate}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="success"
          onClick={handleSubmit}
        >
          Confirm Pay
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Payments() {
  const [payments, setPayments] = useState(null);
  const [dialogInfo, setDialogInfo] = useState({
    open: false
  });
  const { logOut } = useAuth();

  const columns = [
    {
      field: "shopName",
      headerName: "Shop",
      flex: 1
    },
    {
      field: "paymentType",
      headerName: "Type",
      flex: 1
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      valueFormatter: (params) =>
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR"
        }).format(params.value)
    },
    {
      field: "penalty",
      headerName: "Penalty",
      flex: 1,
      valueFormatter: (params) =>
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR"
        }).format(params.value)
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      type: "dateTime",
      valueFormatter: ({ value }) =>
        value
          ? new Date(value).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })
          : "Pending"
    },
    {
      // TODO:
      // [x] Render "Pay now" button here, if paymentDate is null.
      // It should open a modal showing all details.
      // Two buttons in the modal to Pay/Close.
      field: "paymentDate",
      headerName: "Payment Date",
      flex: 1,
      renderCell: (params) => {
        if (!params.value)
          return (
            <Button
              variant="contained"
              onClick={() => handleDialogOpen(params)}
            >
              Pay Now
            </Button>
          );
        return new Date(params.value).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
    }
  ];

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await axios.get("/payment/my");
        console.log(response.data);
        setPayments(response.data);
      } catch (err) {
        logOut();
      }
    }
    fetchPayments();
  }, []);

  const handleDialogOpen = (params) => {
    setDialogInfo({
      ...dialogInfo,
      open: true,
      ...params.row
    });
  };

  const handleDialogClose = () => {
    setDialogInfo({
      open: false
    });
  };

  return payments != null ? (
    <div style={{ height: "80vh", width: "100%" }}>
      <PaymentDialog dialogInfo={dialogInfo} onClose={handleDialogClose} />
      <DataGrid
        getRowId={(row) => `${row.licenseId} ${row.paymentType} ${row.dueDate}`}
        rows={payments}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[10]}
      />
    </div>
  ) : (
    <p>Loading</p>
  );
}
