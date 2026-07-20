import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
    bloodGroup: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch patient profile on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        // Adjust endpoint URL if your backend route differs (e.g., /users/profile or /patient/profile)
        const response = await API.get('/patient/profile');

        if (!isMounted) return;

        const userData = response.data?.user || response.data?.patient || response.data;
        if (userData) {
          setProfile({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || userData.contactNumber || '',
            address: userData.address || '',
            age: userData.age || '',
            gender: userData.gender || '',
            bloodGroup: userData.bloodGroup || '',
          });
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.message || 'Failed to load profile details. Please try again.'
        );
      } finally { // Fixed typo from 'font-medium' to 'finally'
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handle form submission (Update Profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setSaving(true);

      const response = await API.put('/patient/profile', profile);

      if (response.data?.success || response.status === 200) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-slate-500">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-7">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Patient Profile
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal medical information
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              setError('');
              setSuccessMsg('');
            }}
            className="px-4 py-2 text-sm font-semibold rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-md mb-4 text-sm font-medium">
            {successMsg}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing || saving}
              required
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 transition"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={true} // Usually email shouldn't be edited directly
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 text-slate-500 bg-slate-50 cursor-not-allowed"
            />
          </div>

          {/* Phone & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing || saving}
                placeholder="+1 234 567 890"
                className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                disabled={!isEditing || saving}
                placeholder="25"
                className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 transition"
              />
            </div>
          </div>

          {/* Gender & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!isEditing || saving}
                className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-500 transition"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing || saving}
                className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-500 transition"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">
              Address
            </label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing || saving}
              rows={3}
              placeholder="123 Main Street, City"
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 resize-y transition"
            />
          </div>

          {/* Save Button (Only shown when editing) */}
          {isEditing && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;