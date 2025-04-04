import React, { useState, useEffect } from 'react';
import './AdminNewsletter.css';
import { FiLoader } from 'react-icons/fi';
import { Email_Subscribers } from '../../../Config';

const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
   

    useEffect(() => {
        fetchSubscribers();
    }, []);

    // API REQUEST FOR NEWSLATTER
    const fetchSubscribers = async () => {
        try {
            const response = await fetch(Email_Subscribers);
            const data = await response.json();
            
            // Check if data is an array or if it contains an array property
            if (Array.isArray(data)) {
                setSubscribers(data);
            } else if (data && typeof data === 'object') {
                // Look for an array property - common ones might be 'data', 'subscribers', 'results', etc.
                // This is an example - adjust based on your actual API response
                const subscribersArray = data.data || data.subscribers || data.results || [];
                setSubscribers(subscribersArray);
            } else {
                // If we can't find an array, set an empty one
                setSubscribers([]);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (e) => {
        setSortOrder(e.target.value);
    };

    const filteredSubscribers = subscribers
        .filter(subscriber => 
            subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.subscribedAt) - new Date(a.subscribedAt);
            }
            return new Date(a.subscribedAt) - new Date(b.subscribedAt);
        });

    const handleExportCSV = () => {
        const csvContent = [
            ['Email', 'Subscribed Date'],
            ...filteredSubscribers.map(sub => [
                sub.email,
                new Date(sub.subscribedAt).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter_subscribers.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="admin-newsletter">
            <div className="header">
                <h1>Newsletter Subscribers</h1>
                <span className="total-count">
                    Total Subscribers: {filteredSubscribers.length}
                </span>
            </div>

            <div className="controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="sort-box">
                    <select value={sortOrder} onChange={handleSort}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                <button 
                    className="export-btn"
                    onClick={handleExportCSV}
                >
                    Export to CSV
                </button>
            </div>

            {loading ? (
                <div className="subscribers-loading-spinner">{FiLoader}</div>
            ) : (
                <div className="subscribers-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Subscribed Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.map((subscriber) => (
                                <tr key={subscriber._id}>
                                    <td>{subscriber.email}</td>
                                    <td>
                                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="status-active">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminNewsletter;
