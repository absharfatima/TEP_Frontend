import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, pdf, StyleSheet, Image } from '@react-pdf/renderer';
 
const MyTrainings = ({ email }) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'current', 'past'
  const [currentPage, setCurrentPage] = useState(1);
  const trainingsPerPage = 2;
 
  const fetchTrainings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/training-orders/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch training orders');
      }
      const data = await response.json();
      setTrainings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching training orders:', error);
      setError('Failed to fetch training orders');
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchTrainings();
  }, [email]);
 
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`http://localhost:3001/invoices/${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const invoices = await response.json();
        const updatedTrainings = trainings.map(training => {
          const invoice = invoices.find(inv => inv.poId === training._id);
          return invoice ? { ...training, raiseStatus: true, invoiceId: invoice._id } : training;
        });
        setTrainings(updatedTrainings);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
 
    // Fetch invoices only if trainings or email changes
    if (trainings.length > 0) {
      fetchInvoices();
    }
  }, [email, trainings]);
 
  const handleRaiseInvoice = async (trainingId, endDate) => {
    try {
      if (new Date(endDate) < new Date()) {
        const response = await fetch(`http://localhost:3001/raise-invoice/${trainingId}`, {
          method: 'PUT',
        });
        if (response.ok) {
          setTrainings(prevTrainings => {
            return prevTrainings.map(training =>
              training._id === trainingId ? { ...training, raiseStatus: true } : training
            );
          });
        }
      }
    } catch (error) {
      console.error('Error raising invoice:', error);
      // Handle error if necessary
    }
  };



  const qrCodeImageUrl = 'data:image/png;base64,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';
 
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Times-Roman',
      fontSize: 12,
      padding: 20,
    },
    section: {
      marginBottom: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    label: {
      fontWeight: 'bold',
    },
    value: {
      marginLeft: 10,
    },
    qrCodeContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '3cm',
      height: '3cm',
    },
    qrCode: {
      width: 100, // Adjust as needed
      height: 100, // Adjust as needed
      marginTop: 20, // Adjust as needed
    },
    platformHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      marginBottom: 20,
      position: 'absolute',
      top: 30,
      right: 30,
    },
    invoiceContainer: {
      textAlign: 'center',
      marginTop: 50,
    },
    invoiceHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
  
  });
 
  const Invoice = ({ invoiceData }) => (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.platformHeader}>
        <Text>Trainer Engagement Platform</Text>
      </View>
      <Text style={styles.header}>Invoice</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Invoice ID:</Text>
        <Text style={styles.value}>{invoiceData._id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Trainer Name:</Text>
        <Text style={styles.value}>{invoiceData.name}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Trainer Email:</Text>
        <Text style={styles.value}>{invoiceData.email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Contact:</Text>
        <Text style={styles.value}>{invoiceData.contactNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Company Email:</Text>
        <Text style={styles.value}>{invoiceData.companyEmail}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Training Start Date:</Text>
        <Text style={styles.value}>{invoiceData.startDate}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Training End Date:</Text>
        <Text style={styles.value}>{invoiceData.endDate}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Purchase Order Id:</Text>
        <Text style={styles.value}>{invoiceData.poId}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{invoiceData.amount}</Text>
      </View>
      <View style={styles.section}>
        <Image style={styles.qrCode} src={qrCodeImageUrl} />
      </View>
    </Page>
  </Document>

  );
 
  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:3001/invoices/${invoiceId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }
      const invoiceData = await response.json();
 
      // Check if paymentStatus is true
      if (invoiceData.paymentStatus) {
        // Render PDF
        const pdfContent = <Invoice invoiceData={invoiceData} />;
        const blob = await pdf(pdfContent).toBlob();
 
        // Create URL for the blob
        const url = URL.createObjectURL(blob);
 
        // Create a link element and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
 
        // Clean up URL object
        URL.revokeObjectURL(url);
      } else {
        alert("Payment Not Done Yet")
        console.error('Cannot download invoice: Payment has not been completed.');
        // Optionally, you can show a message to the user indicating that the payment needs to be completed.
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };
 
  const filterTrainings = () => {
    const currentDate = new Date();
    if (filter === 'all') {
      return trainings;
    } else if (filter === 'current') {
      return trainings.filter(training => new Date(training.startDate) <= currentDate && new Date(training.endDate) >= currentDate);
    } else if (filter === 'past') {
      return trainings.filter(training => new Date(training.endDate) < currentDate);
    } else if (filter === 'upcoming') {
      return trainings.filter(training => new Date(training.startDate) > currentDate);
    }
  };
 
  const handleFilterChange = newFilter => {
    setFilter(newFilter);
  };
 
  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };
 
  const nextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };
 
  const indexOfLastTraining = currentPage * trainingsPerPage;
  const indexOfFirstTraining = indexOfLastTraining - trainingsPerPage;
  const currentTrainings = filterTrainings().slice(indexOfFirstTraining, indexOfLastTraining);
  const totalPages = Math.ceil(filterTrainings().length / trainingsPerPage);
 
  return (
    <div className="container mx-auto mt-10">
     
      <div className="flex justify-center mb-5">
        <button 
          onClick={() => handleFilterChange('all')}
          className={`mr-4 ${filter === 'all' ? 'bg-blue-800 text-white font-bold py-2 px-2 rounded mr-2' : 'bg-blue-300 text-white font-bold py-2 px-2 rounded mr-2'}`}
        >
          All Trainings
        </button>
        <button
          onClick={() => handleFilterChange('current')}
          className={`mr-4 ${filter === 'current' ? 'bg-blue-800 text-white font-bold py-2 px-2 rounded mr-2' : 'bg-blue-300 text-white font-bold py-2 px-2 rounded mr-2'}`}
        >
          Current Trainings
        </button>
        <button
          onClick={() => handleFilterChange('past')}
          className={`mr-4 ${filter === 'past' ? 'bg-blue-800 text-white font-bold py-2 px-2 rounded mr-2' : 'bg-blue-300 text-white font-bold py-2 px-2 rounded mr-2'}`}
        >
          Past Trainings
        </button>
        <button
          onClick={() => handleFilterChange('upcoming')}
          className={`mr-4 ${filter === 'upcoming' ? 'bg-blue-800 text-white font-bold py-2 px-2 rounded mr-2' : 'bg-blue-300 text-white font-bold py-2 px-2 rounded mr-2'}`}
        >
          Upcoming Trainings
        </button>

        {/* Pagination */}
        <div className="flex justify-end">
          <button onClick={prevPage} disabled={currentPage === 1} className="bg-blue-500 text-white font-bold py-2 px-2 rounded mr-2">
            &lt;
          </button>
          <span className="flex items-center">{`${currentPage} of ${totalPages}`}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white font-bold py-2 px-2 rounded ml-2">
            &gt;
          </button>
        </div>
      </div>

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div>
          {currentTrainings.map(training => (
            <div key={training._id} className="w-full md:w-[700px] border shadow-md ml-[12%] p-4 rounded-md mb-4 bg-gray-50">
              <div >Company Email: {training.companyEmail}</div>
              <div>Trainer Email: {training.trainerEmail}</div>
              <div>Amount: Rs. {training.amount}/-</div>
              <div>Status: {training.status ? 'Accepted' : 'Not Accepted'}</div>
              <div>Start Date: {new Date(training.startDate).toLocaleDateString()}</div>
              <div>End Date: {new Date(training.endDate).toLocaleDateString()}</div>
 
              <div className="mt-4">
                {training.raiseStatus ? (
                  <>
                    <div className="text-green-500 font-semibold">Invoice Raised</div>
                    <button
                      onClick={() => handleDownloadInvoice(training.invoiceId)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Download Invoice
                    </button>
                  </>
                ) : (
                  new Date(training.endDate) < new Date() && training.status && (
                    <button
                      onClick={() => handleRaiseInvoice(training._id, training.endDate)}
                      className="bg-red-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Raise Invoice
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
 
        </div>
      )}
 
    </div>
  );
};
 
export default MyTrainings;
 
 
 
 
 
 
 