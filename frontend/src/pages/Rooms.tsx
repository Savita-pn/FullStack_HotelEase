import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Room {
  _id: string;
  type: string;
  price: number;
  availability: boolean;
  roomNumber: string;
  capacity: number;
  amenities: string[];
  description: string;
  hotelId: {
    _id: string;
    name: string;
  };
}

interface Hotel {
  _id: string;
  name: string;
}

const Rooms: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    type: 'Single',
    price: '',
    roomNumber: '',
    capacity: '',
    hotelId: '',
    amenities: '',
    description: ''
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
      
      const url = editingRoom ? `/api/rooms/${editingRoom._id}` : '/api/rooms';
      const method = editingRoom ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          amenities: amenitiesArray
        })
      });

      if (response.ok) {
        fetchRooms();
        setShowForm(false);
        setEditingRoom(null);
        setFormData({
          type: 'Single',
          price: '',
          roomNumber: '',
          capacity: '',
          hotelId: '',
          amenities: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      type: room.type,
      price: room.price.toString(),
      roomNumber: room.roomNumber,
      capacity: room.capacity.toString(),
      hotelId: room.hotelId._id,
      amenities: room.amenities.join(', '),
      description: room.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/rooms/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          fetchRooms();
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          disabled={hotels.length === 0}
        >
          Add Room
        </button>
      </div>

      {hotels.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          You need to create a hotel first before adding rooms.
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingRoom ? 'Edit Room' : 'Add Room'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.hotelId}
                onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                ))}
              </select>
              
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Family">Family</option>
              </select>

              <input
                type="text"
                placeholder="Room Number"
                value={formData.roomNumber}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                type="number"
                placeholder="Price per night"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
                min="0"
              />

              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
                min="1"
              />

              <input
                type="text"
                placeholder="Amenities (comma separated)"
                value={formData.amenities}
                onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border rounded-lg h-20"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingRoom ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRoom(null);
                    setFormData({
                      type: 'Single',
                      price: '',
                      roomNumber: '',
                      capacity: '',
                      hotelId: '',
                      amenities: '',
                      description: ''
                    });
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
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold">{room.type} - {room.roomNumber}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {room.availability ? 'Available' : 'Occupied'}
              </span>
            </div>
            <p className="text-gray-600 mb-2">🏨 {room.hotelId.name}</p>
            <p className="text-gray-700 mb-2">👥 Capacity: {room.capacity}</p>
            <p className="text-green-600 font-bold mb-4">₹{room.price}/night</p>
            
            {room.description && (
              <p className="text-gray-600 text-sm mb-4">{room.description}</p>
            )}
            
            {room.amenities.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(room)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(room._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && hotels.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No rooms found. Add your first room!</p>
        </div>
      )}
    </div>
  );
};

export default Rooms;