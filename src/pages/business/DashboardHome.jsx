// DASHBOARD HOME FETCH
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
 
const DashboardHome = ({setSelectedLink}) => {
  const { email: businessEmail } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [currentTrainingsCount, setCurrentTrainingsCount] = useState(0);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/businessinvoices/${businessEmail}`);
        const data = await response.json();
        setInvoices(data);
 
        // Calculate current trainings count
        const currentTrainings = data.filter(invoice => invoice.status === 'current' && invoice.email === businessEmail && invoice.paymentStatus === true);
        setCurrentTrainingsCount(currentTrainings.length);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
 
    fetchData();
  }, [businessEmail]);
 
  // Filter invoices with payment status true
  const filteredInvoices = invoices.filter(invoice => invoice.paymentStatus === true);
  // Extracting the part of email before @ and making it uppercase
  const formattedEmail = businessEmail.split('@')[0].toUpperCase();

//   return (
// <>
// <div className="container mx-auto my-5">
// <h2 className="text-3xl font-semibold mb-4 text-center">Welcome, {formattedEmail} !</h2>
// </div> 
 
//       {/* Main Content */}
// <div className="flex-1 bg-gray-100">
// <div className="p-4">
//           {/* Grid Layout */}
// <div className="grid grid-cols-2 gap-4">
// <div className="bg-white p-8 shadow-md">
// <h2 className="text-2xl font-semibold mb-4">No of Invoice Request</h2>
// <p className="text-4xl font-bold text-center text-gray-700">{filteredInvoices.length}</p>
// </div>
// <div className="bg-white p-8 shadow-md">
// <h2 className="text-2xl font-semibold mb-4">Trainings</h2>
// <p className="text-4xl font-bold text-center text-gray-700">{invoices.length}</p>
// </div>
// </div>
// </div>
// </div>
// </>
//   )

return (
  <div>
    <div className="container mx-auto my-8">
      <h2 className="text-3xl font-semibold mb-4 text-center">Welcome, {formattedEmail} !</h2>
    </div>
    <div className="flex flex-wrap">
      <div className="w-full md:w-[300px] rounded-md border shadow-md ml-[10%] mt-10 bg-gray-50">
        <div className="p-4">
          <h1 className="text-lg font-semibold">TOTAL NO. OF INVOICES</h1>
          <p className="mt-3 text-pink-800 text-center text-7xl font-bold">{filteredInvoices.length}</p>
          <button
              type="button"
              className="mt-4 ml-[60%] font-semibold text-black hover:bg-gray-300"
              onClick={() => setSelectedLink('invoices')}
            >
              Know More..
            </button>
        </div>
      </div>

      <div className="w-full md:w-[300px] rounded-md border shadow-md ml-[15%] mt-10 bg-gray-50">
        <div className="p-4">
          <h1 className="text-lg font-semibold">TOTAL TRAININGS</h1>
          <p className="mt-3 text-pink-800 text-center text-7xl font-bold">{invoices.length}</p>
          <button
              type="button"
              className="mt-4 ml-[60%] font-semibold text-black hover:bg-gray-300"
              onClick={() => setSelectedLink('current-trainings')}
            >
              Know More..
            </button>
        </div>
      </div>
     
    </div>
  </div>
);

}
 
export default DashboardHome;