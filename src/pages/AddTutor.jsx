import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

export default function AddTutor() {
  useDocumentTitle('Register as Tutor');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form States
  const [image, setImage] = useState('');
  const [subject, setSubject] = useState('USMLE Step 1');
  const [price, setPrice] = useState('');
  const [institution, setInstitution] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side Validations
    if (!institution.trim()) {
      toast.error('Please specify your medical institution.');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid hourly rate greater than $0.');
      return;
    }

    if (description.trim().length < 20) {
      toast.error('Please write a biography of at least 20 characters.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newTutor = {
        id: `tutor-custom-${Date.now()}`,
        name: user.displayName || 'Doctor / Academic',
        email: user.email,
        image: image.trim() || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk',
        rating: 5.0,
        reviewsCount: 0,
        subjects: [subject],
        price: parseFloat(price),
        description: description.trim(),
        institution: institution.trim(),
        isCustom: true // identify user-created items
      };

      // Retrieve existing custom tutors
      const existingCustom = JSON.parse(localStorage.getItem('customTutors') || '[]');
      existingCustom.unshift(newTutor); // prepend newer listings
      localStorage.setItem('customTutors', JSON.stringify(existingCustom));

      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Your tutor listing has been successfully published!');
        navigate('/tutors');
      }, 800);

    } catch (err) {
      console.error(err);
      toast.error('Failed to create listing. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-900 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 border border-outline-variant/30 dark:border-slate-700 shadow-sm">
        
        <div className="mb-8 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-xs font-bold mb-3">
            MediQueue Career Portal
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Register as a Tutor</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Submit your teaching credentials to help other students master their boards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Read-Only Identity Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Tutor Name (Verified)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">verified_user</span>
                <input
                  type="text"
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-slate-700/50 border border-outline-variant/40 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-not-allowed outline-none"
                  value={user.displayName || 'Authorized Doctor'}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Tutor Email (Verified)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
                <input
                  type="text"
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-slate-700/50 border border-outline-variant/40 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-not-allowed outline-none"
                  value={user.email}
                />
              </div>
            </div>
          </div>

          {/* Image & Subject Specialty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Avatar Image URL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">image</span>
                <input
                  type="url"
                  placeholder="https://example.com/dr-john.jpg"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Primary Specialty Subject</label>
              <select
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="USMLE Step 1">USMLE Step 1</option>
                <option value="Anatomy">Anatomy</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Physiology">Physiology</option>
                <option value="MCAT Prep">MCAT Prep</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Behavioral Science">Behavioral Science</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="OSCE">OSCE</option>
              </select>
            </div>
          </div>

          {/* Institution & Rate Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Medical Institution</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">school</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cleveland Clinic, Mayo Clinic"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Hourly Rate (USD)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">attach_money</span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 75"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Description biography */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Teaching Credentials / Biography</label>
            <textarea
              rows="4"
              required
              placeholder="Tell students about your medical background, teaching methods, board score achievements, and schedule preferences (minimum 20 characters)..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/tutors')}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-xl text-xs font-bold transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Profile'}
              <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
