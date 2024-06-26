import React, { useState, useEffect } from 'react';
import { BarChart, Wallet, Trash } from 'lucide-react';
import BusinessRequestForm from './BusinessRequestForm';
import DashboardHome from './DashboardHome';
import MyProfile from './MyProfile';
import BusinessNavbar from './BusinessNavbar';
import CurrentTrainings from './CurrentTrainings';
import Invoices from './Invoices';
import FeedbackForm from './FeedbackForm';
import { useNavigate } from 'react-router-dom';

function BusinessDashboard() {
  const [email, setEmail] = useState(null);
  const [selectedLink, setSelectedLink] = useState('dashboard');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const emailStartIndex = url.lastIndexOf('/') + 1;
    const emailEndIndex = url.indexOf('@') + 1;
    const extractedEmail = url.slice(emailStartIndex, emailEndIndex);
    setEmail(extractedEmail + 'gmail.com'); // Append @gmail.com
  }, []);


  const handleConfirmation = async (confirm) => {
    setShowDeleteConfirmation(false);
  
    if (confirm) {
      try {
        const response = await fetch(`http://localhost:3001/companies/requestDeletion/${encodeURIComponent(email)}`, {
          method: 'POST',
        });
  
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const data = await response.json();
          alert(data.message); // Display success message
          navigate('/sign-in');
        } else {
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.error(`Error sending deletion request: ${data.error}`);
          } else {
            const errorMessage = await response.text();
            console.error(`Error sending deletion request: ${errorMessage}`);
          }
          alert('Failed to send deletion request. Please try again later.');
        }
      } catch (error) {
        console.error('Error sending deletion request:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };


  const handleDeleteAccount = async () => {
    try {
      // Check for unpaid invoices
      const response = await fetch(`http://localhost:3001/businessinvoices/unpaid/${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error(`Error checking unpaid invoices: ${response.statusText}`);
      }
  
      const unpaidInvoices = await response.json();
  
      if (unpaidInvoices.length > 0) {
        alert("You are unable to delete your account due to outstanding unpaid invoices.");
      } else {
        // Show confirmation modal
        setShowDeleteConfirmation(true);
      }
    } catch (error) {
      console.error('Error checking unpaid invoices:', error);
    }
  };
  

  const renderComponent = () => {
    switch (selectedLink) {
      case 'dashboard':
        return <DashboardHome email={email} setSelectedLink= {setSelectedLink}/>;
      case 'my-profile':
        return <MyProfile email={email} />;
      case 'trainer-request':
        return <BusinessRequestForm email={email} />;
      case 'current-trainings':
        return <CurrentTrainings email={email} />;
      case 'invoices':
        return <Invoices email={email} />;
      case 'feedback':
        return <FeedbackForm email={email} />;
      default:
        return null;
    }
  };

  return (
    <>
      <BusinessNavbar />
      <div className="flex h-screen">
        <aside className="flex h-screen w-64 flex-col overflow-y-auto border-r bg-black px-5 py-8">
          <div className="mt-6 flex flex-1 flex-col justify-between">
            <nav className="-mx-3 space-y-6">
              <div
                onClick={() => setSelectedLink('dashboard')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${selectedLink === 'dashboard' ? 'bg-gray-100 text-gray-700' : ''
                  }`}
              >
                <BarChart className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Dashboard</span>
              </div>
 
              <div
                onClick={() => setSelectedLink('my-profile')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${selectedLink === 'my-profile' ? 'bg-gray-100 text-gray-700' : ''
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
 
                <span className="mx-2 text-sm font-medium">My Profile</span>
              </div>
              <div
                onClick={() => setSelectedLink('trainer-request')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${selectedLink === 'trainer-request' ? 'bg-gray-100 text-gray-700' : ''
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
 
                <span className="mx-2 text-sm font-medium">Trainer Request</span>
              </div>
 
              <div
                onClick={() => setSelectedLink('current-trainings')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${selectedLink === 'current-trainings' ? 'bg-gray-100 text-gray-700' : ''
                  }`}
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
</svg>
 
                <span className="mx-2 text-sm font-medium">Trainings</span>
              </div>
 
              <div
                onClick={() => setSelectedLink('invoices')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${selectedLink === 'invoices' ? 'bg-gray-100 text-gray-700' : ''
                  }`}
              >
                <Wallet className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Invoices</span>
              </div>
 
              <div
                onClick={() => setSelectedLink('feedback')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${selectedLink === 'feedback' ? 'bg-gray-100 text-gray-700' : ''
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
 
                <span className="mx-2 text-sm font-medium">Feedback</span>
              </div>

              <div
                onClick={() => setSelectedLink('deleteAccount')}
                className={`flex transform items-center rounded-lg px-3 py-2 text-red-500 transition-colors duration-300 hover:bg-purple-500 hover:text-white ${
                  selectedLink === 'deleteAccount' ? 'bg-gray-100 text-gray-700' : ''
                }`}
              >
                <Trash className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium cursor-pointer">Delete Request</span>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-md">
                <p className="mb-4">Are you sure you want to send a request for account deletion?</p>
                <div className="flex justify-end">
                  <button
                    className="mr-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => handleConfirmation(true)}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => handleConfirmation(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          {selectedLink === 'deleteAccount' ? (
            <div className="p-8">
              <p className="mb-4">Confirm account deletion request?</p>
              <button
                className="hover:bg-red-500 bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleDeleteAccount}
              >
                Send Delete Request
              </button>
            </div>
          ) : (
            renderComponent()
          )}
        </main>
      </div>
    </>
  );
}

export default BusinessDashboard;
