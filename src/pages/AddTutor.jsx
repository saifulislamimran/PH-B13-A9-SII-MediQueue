import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

const AVAILABLE_SUBJECTS = [
  "USMLE Step 1",
  "Anatomy",
  "Cardiology",
  "Physiology",
  "MCAT Prep",
  "Biochemistry",
  "Psychiatry",
  "Behavioral Science",
  "Internal Medicine",
  "OSCE"
];

export default function AddTutor() {
  useDocumentTitle('Register Tutor Manually');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [designation, setDesignation] = useState('Dr.');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [generatedUserId, setGeneratedUserId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate Credentials Function
  const generateTempCredentials = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const userId = `MQ-TUT-${randomNum}`;
    const password = `MQ-Temp-${randomStr}-${randomNum}!`;
    setGeneratedUserId(userId);
    setGeneratedPassword(password);
  };

  // Generate on load
  useEffect(() => {
    generateTempCredentials();
  }, []);

  // Pre-fill with current user's profile if they are a student applying to become tutor
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'tutor') {
      setFullName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const toggleSubject = (sub) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!fullName.trim()) {
      toast.error('Please enter the full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!institution.trim()) {
      toast.error('Please specify the medical institution.');
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one specialty discipline.');
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

      const targetUid = `mock-uid-${Date.now()}`;
      
      // 1. Create registration user in mock_users_db
      const db = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
      
      // Avoid duplicate emails
      if (db.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
        toast.error('A user with this email already exists.');
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        uid: targetUid,
        email: email.trim(),
        password: generatedPassword,
        displayName: fullName.trim(),
        photoURL: image.trim() || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk',
        role: 'tutor'
      };

      db.push(newUser);
      localStorage.setItem("mock_users_db", JSON.stringify(db));

      // 2. Set roles in localStorage
      localStorage.setItem(`role_${targetUid}`, 'tutor');
      localStorage.setItem(`role_${email.trim()}`, 'tutor');

      // 3. Set profile details in localStorage
      const tutorProfile = {
        studentTutorId: generatedUserId,
        institution: institution.trim(),
        designation: designation.trim(),
        subscriptionStatus: 'premium',
        age: 35
      };
      localStorage.setItem(`profile_${targetUid}`, JSON.stringify(tutorProfile));
      localStorage.setItem(`profile_${email.trim()}`, JSON.stringify(tutorProfile));

      // 4. Create Tutor Listing in customTutors
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      const newTutorListing = {
        id: `tutor-custom-${targetUid}`,
        name: fullName.trim(),
        email: email.trim(),
        subjects: selectedSubjects,
        price: parseFloat(price),
        description: description.trim(),
        institution: institution.trim(),
        image: newUser.photoURL,
        rating: 5.0,
        reviewsCount: 0,
        available: true,
        status: 'approved', // instantly approved since manually added
        isCustom: true
      };

      customTutors.unshift(newTutorListing);
      localStorage.setItem('customTutors', JSON.stringify(customTutors));

      // 5. Add default metadata to CRM admin state
      const savedCrmMeta = localStorage.getItem('admin_tutors_crm');
      let crmMeta = savedCrmMeta ? JSON.parse(savedCrmMeta) : [];
      crmMeta.push({
        id: newTutorListing.id,
        workHoursLogged: 0,
        sessionsCompleted: 0,
        joinDate: new Date().toISOString().split('T')[0],
        contractEndDate: '2027-10-01',
        status: 'approved'
      });
      localStorage.setItem('admin_tutors_crm', JSON.stringify(crmMeta));

      setTimeout(() => {
        setIsSubmitting(false);
        toast.success(`Successfully registered Tutor ${fullName}! Account created.`);
        
        // Navigate back to where they came from
        if (user && user.role === 'admin') {
          navigate('/admin-dashboard?tab=tutors');
        } else {
          navigate('/tutors');
        }
      }, 800);

    } catch (err) {
      console.error(err);
      toast.error('Failed to create listing. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-900 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 border border-outline-variant/30 dark:border-slate-700 shadow-sm space-y-6">
        
        <div className="text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-xs font-bold mb-3">
            MediQueue Career Portal
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manually Add Tutor</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create an instructor account, auto-generate temp login credentials, and publish their clinical tutoring profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Identity fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">person</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John Watson"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
                <input
                  type="email"
                  required
                  placeholder="e.g. watson@medical.edu"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Institution & Designation */}
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
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Academic Designation</label>
              <select
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="Dr.">Dr.</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Clinical Instructor">Clinical Instructor</option>
                <option value="Resident Physician">Resident Physician</option>
                <option value="MD Candidate">MD Candidate</option>
              </select>
            </div>
          </div>

          {/* Specialty Discipline Multi-Select */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">
              Specialty Disciplines (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-700">
              {AVAILABLE_SUBJECTS.map((sub) => {
                const isSelected = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hourly Rate & Avatar URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Avatar Image URL (Optional)</label>
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
          </div>

          {/* Biography */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Credentials & Teaching Bio</label>
            <textarea
              rows="3"
              required
              placeholder="Tell students about your medical background, teaching methods, board score achievements, and schedule preferences (minimum 20 characters)..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Credential Generation Panel */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-extrabold text-gray-750 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">key</span>
              Generated Temp Credentials
            </h3>
            <p className="text-[10px] text-gray-500">
              The user account will be created using the email address above and this temporary password. The Tutor ID serves as their public identifier.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Tutor ID / User ID</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 outline-none"
                    value={generatedUserId}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedUserId);
                      toast.success("User ID copied!");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary flex items-center"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Temporary Password</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 outline-none"
                    value={generatedPassword}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      toast.success("Password copied!");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary flex items-center"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={generateTempCredentials}
              className="text-[11px] text-primary dark:text-primary-fixed-dim hover:underline font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Regenerate Credentials
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                if (user && user.role === 'admin') {
                  navigate('/admin-dashboard?tab=tutors');
                } else {
                  navigate('/tutors');
                }
              }}
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
              {isSubmitting ? 'Registering...' : 'Register Tutor'}
              <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
