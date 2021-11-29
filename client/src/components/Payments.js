import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../axios";
import { useAuth } from "../use-auth";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slide,
  Typography
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function PaymentDialog({ dialogInfo, onClose }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`payment/pay/${dialogInfo.paymentId}`);
      toast.success(response.data.message, toastOptions);
    } catch (err) {
      toast.error(err.response.data.message, toastOptions);
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
  const { user, logOut } = useAuth();

  const confirmPayment = async (event, paymentId) => {
    event.preventDefault();
    try {
      const response = await axios.get(`/payment/confirm/${paymentId}`);
      await fetchPayments();
      toast.success(response.data.message, toastOptions);
      setDialogInfo({ open: false });
    } catch (err) {
      toast.error(err.response.data.message, toastOptions);
    }
  };

  const fetchPayments = async () => {
    try {
      let url = "/payment/my";
      if (user.userRole === "ADMIN") url = "/payment/all";
      const response = await axios.get(url);
      console.log(response.data);
      setPayments(response.data);
    } catch (err) {
      logOut();
    }
  };

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
      field: "paymentStatus",
      headerName: "Status",
      flex: 1
    }
  ];

  if (user.userRole === "SHOPKEEPER")
    columns.push({
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
    });
  else if (user.userRole === "ADMIN") {
    columns.push({
      field: "",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        if (params.row.paymentStatus === "PENDING APPROVAL")
          return (
            <Button
              color="success"
              variant="contained"
              onClick={(event) => confirmPayment(event, params.row.paymentId)}
            >
              Approve
            </Button>
          );
      }
    });
    columns.unshift.apply(columns, [
      {
        field: "fullName",
        headerName: "Shop Keeper",
        flex: 1
      }
    ]);
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDialogOpen = (params) => {
    setDialogInfo({
      ...dialogInfo,
      open: true,
      ...params.row
    });
  };

  const handleDialogClose = async () => {
    await fetchPayments();
    setDialogInfo({
      open: false
    });
  };

  return payments != null ? (
    <div style={{ height: "80vh", width: "100%" }}>
      <PaymentDialog dialogInfo={dialogInfo} onClose={handleDialogClose} />
      <ToastContainer />
      <DataGrid
        getRowId={(row) => `${row.licenseId} ${row.paymentType} ${row.dueDate}`}
        rows={payments}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  ) : (
    <p>Loading</p>
  );
}
