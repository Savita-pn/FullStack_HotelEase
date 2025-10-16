import React, { useState, useEffect } from 'react';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description: string;
  amenities: string[];
  totalRooms: number;
  rating: number;
}

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    amenities: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hotels/manager/my-hotels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setHotels(data.hotels);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
      
      const url = editingHotel ? `/api/hotels/${editingHotel._id}` : '/api/hotels';
      const method = editingHotel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amenities: amenitiesArray
        })
      });

      if (response.ok) {
        fetchHotels();
        setShowForm(false);
        setEditingHotel(null);
        setFormData({ name: '', location: '', description: '', amenities: '' });
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      amenities: hotel.amenities.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/hotels/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          fetchHotels();
        }
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Hotel
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingHotel ? 'Edit Hotel' : 'Add Hotel'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Hotel Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border rounded-lg h-24"
                required
              />
              <input
                type="text"
                placeholder="Amenities (comma separated)"
                value={formData.amenities}
                onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingHotel ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingHotel(null);
                    setFormData({ name: '', location: '', description: '', amenities: '' });
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
            <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
            <p className="text-gray-700 mb-4">{hotel.description}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Amenities:</p>
              <div className="flex flex-wrap gap-1">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rooms: {hotel.totalRooms}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(hotel)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hotels found. Add your first hotel!</p>
        </div>
      )}
    </div>
  );
};

export default Hotels;