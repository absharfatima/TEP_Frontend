//INVOICE FETCH
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
 
const Invoices = ({ email }) => {
  const { email: businessEmail } = useParams(); // Extract email id from the URL
  const [businessInvoices, setBusinessInvoices] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all details for a particular business using businessEmail
        const response = await fetch(`http://localhost:3001/businessinvoices/${businessEmail}`);
        if (!response.ok) {
          throw new Error(`Error fetching business invoices: ${response.statusText}`);
        }
 
        const data = await response.json();
        setBusinessInvoices(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [businessEmail]); // Fetch data whenever businessEmail changes

    // Accepting or Rejecting Invoice
    const handleInvoiceAction = async (invoice, action) => {
      try {
        let method, endpoint;
  
        // Determine method and endpoint based on the action
        if (action === "accept") {
          method = "PUT";
          endpoint = `http://localhost:3001/businessinvoices/${invoice._id}/accept`;
        } else if (action === "reject") {
          method = "DELETE";
          endpoint = `http://localhost:3001/businessinvoices/${invoice._id}/reject`;
        } else {
          throw new Error("Invalid action");
        }
  
        // Update paymentStatus based on the action (accept or reject)
        const response = await fetch(endpoint, {
          method: method,
        });
  
        if (!response.ok) {
          throw new Error(`Error updating/deleting invoice: ${response.statusText}`);
        }
  
        // Update the invoice in the frontend state
        if (action === "accept") {
          const updatedInvoice = await response.json();
          const updatedInvoices = businessInvoices.map((inv) =>
            inv._id === updatedInvoice._id ? updatedInvoice : inv
          );
          setBusinessInvoices(updatedInvoices);
        } else if (action === "reject") {
          const updatedInvoices = businessInvoices.filter((inv) => inv._id !== invoice._id);
          setBusinessInvoices(updatedInvoices);
        }
  
        alert(
          action === "accept"
            ? "Invoice accepted successfully!"
            : "Invoice rejected and deleted successfully!"
        );
      } catch (err) {
        console.error(err);
        alert(`Error processing invoice: ${err.message}`);
      }
    };
  
 
  return (
    <>
      <div className="container mx-auto px-2 py-4">
        <h2 className="text-2xl font-bold mb-4 text-black">Business Invoices</h2>
        <div>
          {businessInvoices.map((invoice) => (
            <div key={invoice._id} className="border shadow-md p-4 rounded-md mb-4">
              <div>Company Name: {invoice.companyName}</div>
              <div>Amount: {invoice.amount}</div>
              <div>Batch: {invoice.batches}</div>
              <div>Start Date: {new Date(invoice.startDate).toLocaleDateString()}</div>
              <div>End Date: {new Date(invoice.endDate).toLocaleDateString()}</div>
              <div>Payment Status: {invoice.paymentStatus ? 'Paid' : 'Not Paid'}</div>
              <div className="mt-4">
                <button
                  onClick={() => handleInvoiceAction(invoice, "accept")}
                  disabled={invoice.paymentStatus}
                  className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleInvoiceAction(invoice, "reject")}
                  disabled={invoice.paymentStatus}
                  className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
 
export default Invoices;



// // Invoices.js
// import React, { useEffect } from 'react';
// import { connect } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { fetchInvoices, handleInvoiceAction } from '../../actions/invoicesActions';

// const Invoices = ({ email, businessInvoices, fetchInvoices, handleInvoiceAction }) => {
//   const { email: businessEmail } = useParams(); // Extract email id from the URL

//   useEffect(() => {
//     fetchInvoices(businessEmail);
//   }, [businessEmail, fetchInvoices]);

//   return (
//     <>
//       <div className="container mx-auto px-2 py-4">
//         <h2 className="text-2xl font-bold mb-4 text-black">Business Invoices</h2>
//         <div>
//           {businessInvoices.map((invoice) => (
//             <div key={invoice._id} className="border shadow-md p-4 rounded-md mb-4">
//               <div>Company Name: {invoice.companyName}</div>
//               <div>Amount: {invoice.amount}</div>
//               <div>Batch: {invoice.batches}</div>
//               <div>Start Date: {new Date(invoice.startDate).toLocaleDateString()}</div>
//               <div>End Date: {new Date(invoice.endDate).toLocaleDateString()}</div>
//               <div>Payment Status: {invoice.paymentStatus ? 'Paid' : 'Not Paid'}</div>
//               <div className="mt-4">
//                 <button
//                   onClick={() => handleInvoiceAction(invoice, "accept")}
//                   disabled={invoice.paymentStatus}
//                   className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleInvoiceAction(invoice, "reject")}
//                   disabled={invoice.paymentStatus}
//                   className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   businessInvoices: state.invoices,
// });

// const mapDispatchToProps = {
//   fetchInvoices,
//   handleInvoiceAction,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Invoices);


// // Invoices.js
// import React, { useEffect } from 'react';
// import { connect } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { fetchInvoices, handleInvoiceAction } from '../../actions/invoicesActions';

// const Invoices = ({ businessEmail, businessInvoices, error, fetchInvoices, handleInvoiceAction }) => {
//   useEffect(() => {
//     fetchInvoices(businessEmail);
//   }, [businessEmail, fetchInvoices]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <div className="container mx-auto px-2 py-4">
//         <h2 className="text-2xl font-bold mb-4 text-black">Business Invoices</h2>
//         <div>
//           {businessInvoices.map((invoice) => (
//             <div key={invoice._id} className="border shadow-md p-4 rounded-md mb-4">
//               <div>Company Name: {invoice.companyName}</div>
//               <div>Amount: {invoice.amount}</div>
//               <div>Batch: {invoice.batches}</div>
//               <div>Start Date: {new Date(invoice.startDate).toLocaleDateString()}</div>
//               <div>End Date: {new Date(invoice.endDate).toLocaleDateString()}</div>
//               <div>Payment Status: {invoice.paymentStatus ? 'Paid' : 'Not Paid'}</div>
//               <div className="mt-4">
//                 <button
//                   onClick={() => handleInvoiceAction(invoice, "accept")}
//                   disabled={invoice.paymentStatus}
//                   className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleInvoiceAction(invoice, "reject")}
//                   disabled={invoice.paymentStatus}
//                   className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   businessEmail: state.businessEmail, // Add the businessEmail state
//   invoices: state.invoices.invoices,
//   error: state.invoices.error,
// });

// const mapDispatchToProps = {
//   fetchInvoices,
//   handleInvoiceAction,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Invoices);


// // Invoices.js

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { acceptInvoice, rejectInvoice } from './actions';
// // import { acceptInvoice, rejectInvoice } from '../../actions/invoicesActions';


// const Invoices = ({ email }) => {
//   const dispatch = useDispatch();
//   const businessInvoices = useSelector((state) => state.invoices.businessInvoices);

//   useEffect(() => {
//     // Fetch data from the API and dispatch an action to update state
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:3001/businessinvoices/${email}`);
//         if (!response.ok) {
//           throw new Error(`Error fetching business invoices: ${response.statusText}`);
//         }

//         const data = await response.json();
//         // Dispatch action to update state with fetched data
//         // Replace 'fetchInvoicesSuccess' with an appropriate action
//         dispatch(fetchInvoicesSuccess(data));
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [dispatch, email]);

//   const handleInvoiceAction = (invoice, action) => {
//     if (action === 'accept') {
//       dispatch(acceptInvoice(invoice._id));
//     } else if (action === 'reject') {
//       dispatch(rejectInvoice(invoice._id));
//     }
//   };

//   return (
//     <>
//       <div className="container mx-auto px-2 py-4">
//         <h2 className="text-2xl font-bold mb-4 text-black">Business Invoices</h2>
//         <div>
//           {businessInvoices.map((invoice) => (
//             <div key={invoice._id} className="border shadow-md p-4 rounded-md mb-4">
//               <div>Company Name: {invoice.companyName}</div>
//               <div>Amount: {invoice.amount}</div>
//               <div>Batch: {invoice.batches}</div>
//               <div>Start Date: {new Date(invoice.startDate).toLocaleDateString()}</div>
//               <div>End Date: {new Date(invoice.endDate).toLocaleDateString()}</div>
//               <div>Payment Status: {invoice.paymentStatus ? 'Paid' : 'Not Paid'}</div>
//               <div className="mt-4">
//                 <button
//                   onClick={() => handleInvoiceAction(invoice, "accept")}
//                   disabled={invoice.paymentStatus}
//                   className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleInvoiceAction(invoice, "reject")}
//                   disabled={invoice.paymentStatus}
//                   className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${invoice.paymentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// // This is just a placeholder, replace it with your actual action creator
// const fetchInvoicesSuccess = (invoices) => ({
//   type: 'FETCH_INVOICES_SUCCESS',
//   payload: { invoices },
// });

// export default Invoices;