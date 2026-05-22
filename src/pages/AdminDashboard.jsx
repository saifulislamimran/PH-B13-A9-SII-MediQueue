import React, { useState, useEffect, useMemo } from 'react';
import { mockTutors } from '../data/mockTutors';
import useDocumentTitle from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  useDocumentTitle('System CRM Dashboard');

  // Navigation state
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'students', 'tutors', 'financials', 'approvals'

  // CRM Data States
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [tutorApplications, setTutorApplications] = useState([]);

  // Form Modals states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  // Review Modals states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedFields, setApprovedFields] = useState({
    displayName: true,
    email: true,
    role: true,
    studentTutorId: true
  });

  const [isTutorAppModalOpen, setIsTutorAppModalOpen] = useState(false);
  const [selectedTutorApp, setSelectedTutorApp] = useState(null);

  // Student Form Fields
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [assignedTutor, setAssignedTutor] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('10:00 AM - 11:00 AM');
  const [performance, setPerformance] = useState('Good (85%)');
  const [taskStatus, setTaskStatus] = useState('In Progress');

  // Transaction Form Fields
  const [txType, setTxType] = useState('inflow');
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txStatus, setTxStatus] = useState('Completed');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Load and sync CRM data from localStorage
  const loadAllData = () => {
    // 1. Students CRM
    let savedStudents = localStorage.getItem('admin_students');
    if (!savedStudents) {
      const defaultStudents = [
        {
          id: 'student-1',
          name: 'Emma Watson',
          email: 'emma.w@academy.edu',
          assignedTutor: 'Dr. Sarah Johnson',
          scheduleDate: '2026-05-25',
          scheduleTime: '10:00 AM - 11:00 AM',
          performance: 'Excellent (95%)',
          taskStatus: 'Completed',
          joinDate: '2026-02-15'
        },
        {
          id: 'student-2',
          name: 'Lucas Miller',
          email: 'lucas.m@medical.edu',
          assignedTutor: 'Alex Rivera',
          scheduleDate: '2026-05-27',
          scheduleTime: '02:00 PM - 03:00 PM',
          performance: 'Good (84%)',
          taskStatus: 'In Progress',
          joinDate: '2026-03-01'
        },
        {
          id: 'student-3',
          name: 'Sophia Chen',
          email: 'sophia.c@university.edu',
          assignedTutor: 'Dr. Michael Chen',
          scheduleDate: '2026-05-29',
          scheduleTime: '11:00 AM - 12:00 PM',
          performance: 'Needs Review (62%)',
          taskStatus: 'Overdue',
          joinDate: '2026-04-10'
        }
      ];
      localStorage.setItem('admin_students', JSON.stringify(defaultStudents));
      savedStudents = JSON.stringify(defaultStudents);
    }
    setStudents(JSON.parse(savedStudents));

    // 2. Financial Ledger
    let savedLedger = localStorage.getItem('admin_financial_ledger');
    if (!savedLedger) {
      const defaultLedger = [
        { id: 'tx-1001', type: 'inflow', description: 'Student Booking: Emma Watson (Anatomy)', amount: 85, date: '2026-05-18', status: 'Completed' },
        { id: 'tx-1002', type: 'inflow', description: 'Student Booking: Lucas Miller (Cardiology)', amount: 65, date: '2026-05-19', status: 'Completed' },
        { id: 'tx-1003', type: 'outflow', description: 'Tutor Payout: Dr. Sarah Johnson', amount: 170, date: '2026-05-20', status: 'Completed' },
        { id: 'tx-1004', type: 'inflow', description: 'Student Booking: Sophia Chen (Neurology)', amount: 95, date: '2026-05-21', status: 'Completed' },
        { id: 'tx-1005', type: 'outflow', description: 'Tutor Payout: Alex Rivera', amount: 130, date: '2026-05-21', status: 'Pending' }
      ];
      localStorage.setItem('admin_financial_ledger', JSON.stringify(defaultLedger));
      savedLedger = JSON.stringify(defaultLedger);
    }
    setLedger(JSON.parse(savedLedger));

    // 3. Tutors (Base + CRM metadata)
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const allBaseTutors = [...customTutors, ...mockTutors];
    
    let savedCrmMeta = localStorage.getItem('admin_tutors_crm');
    let crmMeta = savedCrmMeta ? JSON.parse(savedCrmMeta) : [];

    const mergedTutors = allBaseTutors.map(t => {
      let meta = crmMeta.find(m => m.id === t.id);
      if (!meta) {
        meta = {
          id: t.id,
          workHoursLogged: t.isCustom ? 0 : Math.floor(Math.random() * 80) + 10,
          sessionsCompleted: t.isCustom ? 0 : Math.floor(Math.random() * 30) + 5,
          joinDate: t.isCustom ? new Date().toISOString().split('T')[0] : '2025-10-01',
          contractEndDate: '2027-10-01',
          status: t.status || 'approved'
        };
        crmMeta.push(meta);
      }
      return {
        ...t,
        workHoursLogged: meta.workHoursLogged,
        sessionsCompleted: meta.sessionsCompleted,
        joinDate: meta.joinDate,
        contractEndDate: meta.contractEndDate,
        status: meta.status || t.status || 'approved'
      };
    });
    
    localStorage.setItem('admin_tutors_crm', JSON.stringify(crmMeta));
    setTutors(mergedTutors);

    // 4. Change Requests
    let savedRequests = localStorage.getItem('profile_change_requests');
    if (!savedRequests) {
      const defaultRequests = [
        {
          id: 'req-default-1',
          userId: 'mock-uid-default-student',
          userEmail: 'lucas.m@medical.edu',
          userName: 'Lucas Miller',
          oldValues: {
            displayName: 'Lucas Miller',
            email: 'lucas.m@medical.edu',
            role: 'student',
            studentTutorId: 'MQ-LUCASM'
          },
          requestedChanges: {
            displayName: 'Dr. Lucas Miller',
            email: 'lucas.miller@mayo.edu',
            role: 'student',
            studentTutorId: 'MQ-LUCASDR'
          },
          status: 'pending',
          requestedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('profile_change_requests', JSON.stringify(defaultRequests));
      savedRequests = JSON.stringify(defaultRequests);
    }
    setChangeRequests(JSON.parse(savedRequests));

    // 5. Tutor Applications
    let savedApps = localStorage.getItem('tutor_applications');
    if (!savedApps) {
      const defaultApps = [
        {
          id: 'app-default-1',
          userId: 'mock-uid-default-student',
          userName: 'Lucas Miller',
          userEmail: 'lucas.m@medical.edu',
          subjects: ['Cardiology'],
          institution: 'Mayo Clinic Alix School of Medicine',
          price: 70,
          bio: 'MD candidate with 2 years of tutoring experience in medical physiology and cardiac anatomy. EKG certified.',
          credentialsUrl: 'https://example.com/lucas-medical-degree.pdf',
          status: 'pending',
          appliedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('tutor_applications', JSON.stringify(defaultApps));
      savedApps = JSON.stringify(defaultApps);
    }
    setTutorApplications(JSON.parse(savedApps));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Compute overall stats dynamically
  const stats = useMemo(() => {
    const totalTutors = tutors.length;
    const totalStudents = students.length;
    
    // Bookings count from bookings DB
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const totalBookings = bookings.length;
    
    // Financial Inflows/Outflows
    const inflowTotal = ledger.filter(tx => tx.type === 'inflow' && tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0);
    const outflowTotal = ledger.filter(tx => tx.type === 'outflow' && tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0);
    const netProfit = inflowTotal - outflowTotal;

    // Specialty Subject distribution
    const subjectDistribution = {};
    tutors.forEach(t => {
      t.subjects?.forEach(sub => {
        subjectDistribution[sub] = (subjectDistribution[sub] || 0) + 1;
      });
    });

    const pendingAppsCount = tutorApplications.filter(a => a.status === 'pending').length;
    const pendingRequestsCount = changeRequests.filter(r => r.status === 'pending').length;
    const totalPendingApprovals = pendingAppsCount + pendingRequestsCount;

    return {
      totalTutors,
      totalStudents,
      totalBookings,
      inflowTotal,
      outflowTotal,
      netProfit,
      subjectDistribution,
      pendingAppsCount,
      pendingRequestsCount,
      totalPendingApprovals
    };
  }, [tutors, students, ledger, tutorApplications, changeRequests]);

  // Approved tutors list for selectors
  const approvedTutors = useMemo(() => {
    return tutors.filter(t => t.status === 'approved');
  }, [tutors]);

  // Actions: Student CRM
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      toast.error('Student Name and Email are required.');
      return;
    }

    const newStudent = {
      id: `student-${Date.now()}`,
      name: studentName.trim(),
      email: studentEmail.trim(),
      assignedTutor: assignedTutor || (approvedTutors[0]?.name || 'N/A'),
      scheduleDate: scheduleDate || new Date().toISOString().split('T')[0],
      scheduleTime,
      performance,
      taskStatus,
      joinDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...students, newStudent];
    localStorage.setItem('admin_students', JSON.stringify(updated));
    setStudents(updated);
    setIsAddStudentOpen(false);
    
    // Reset Form fields
    setStudentName('');
    setStudentEmail('');
    setScheduleDate('');
    toast.success(`Student ${newStudent.name} added manually.`);
  };

  const handleBanStudent = (studentId, name) => {
    const confirm = window.confirm(`Are you sure you want to ban/remove student ${name}?`);
    if (!confirm) return;

    const updated = students.filter(s => s.id !== studentId);
    localStorage.setItem('admin_students', JSON.stringify(updated));
    setStudents(updated);
    toast.success(`Student ${name} has been banned/removed.`);
  };

  // Actions: Tutor Approvals
  const handleApproveTutor = (tutorId, name) => {
    // 1. Update in customTutors
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const updatedCustom = customTutors.map(t => {
      if (t.id === tutorId) {
        return { ...t, status: 'approved' };
      }
      return t;
    });
    localStorage.setItem('customTutors', JSON.stringify(updatedCustom));

    // 2. Update CRM metadata
    const savedCrmMeta = localStorage.getItem('admin_tutors_crm');
    let crmMeta = savedCrmMeta ? JSON.parse(savedCrmMeta) : [];
    const updatedCrm = crmMeta.map(m => {
      if (m.id === tutorId) {
        return { ...m, status: 'approved' };
      }
      return m;
    });
    localStorage.setItem('admin_tutors_crm', JSON.stringify(updatedCrm));

    toast.success(`Approved role for ${name}!`);
    loadAllData();
  };

  const handleBanTutor = (tutorId, name) => {
    const confirm = window.confirm(`Are you sure you want to ban/remove tutor ${name}?`);
    if (!confirm) return;

    // Remove from customTutors
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const updatedCustom = customTutors.filter(t => t.id !== tutorId);
    localStorage.setItem('customTutors', JSON.stringify(updatedCustom));

    // Remove from CRM metadata
    const savedCrmMeta = localStorage.getItem('admin_tutors_crm');
    let crmMeta = savedCrmMeta ? JSON.parse(savedCrmMeta) : [];
    const updatedCrm = crmMeta.filter(m => m.id !== tutorId);
    localStorage.setItem('admin_tutors_crm', JSON.stringify(updatedCrm));

    toast.success(`Tutor ${name} has been banned and removed.`);
    loadAllData();
  };

  // Actions: Financial Ledger
  const handleAddTxSubmit = (e) => {
    e.preventDefault();
    if (!txDesc.trim() || !txAmount) {
      toast.error('Description and Amount are required.');
      return;
    }

    const newTx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      type: txType,
      description: txDesc.trim(),
      amount: parseFloat(txAmount),
      date: txDate || new Date().toISOString().split('T')[0],
      status: txStatus
    };

    const updated = [...ledger, newTx];
    localStorage.setItem('admin_financial_ledger', JSON.stringify(updated));
    setLedger(updated);
    setIsAddTxOpen(false);

    // Reset Form
    setTxDesc('');
    setTxAmount('');
    toast.success('Transaction recorded in ledger.');
  };

  // Actions: Profile Change Request Approval
  const openRequestReview = (req) => {
    setSelectedRequest(req);
    setApprovedFields({
      displayName: req.oldValues.displayName !== req.requestedChanges.displayName,
      email: req.oldValues.email !== req.requestedChanges.email,
      role: req.oldValues.role !== req.requestedChanges.role,
      studentTutorId: req.oldValues.studentTutorId !== req.requestedChanges.studentTutorId
    });
    setIsRequestModalOpen(true);
  };

  const handleApproveChangeRequestSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const { userId, userEmail, requestedChanges } = selectedRequest;
      const approvedKeys = Object.keys(approvedFields).filter(key => approvedFields[key]);

      if (approvedKeys.length === 0) {
        toast.error("Please select at least one field to approve, or deny the request instead.");
        return;
      }

      // 1. Update mock_users_db
      const db = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
      const userIndex = db.findIndex(u => u.uid === userId || u.email.toLowerCase() === userEmail.toLowerCase());
      if (userIndex !== -1) {
        if (approvedFields.displayName) db[userIndex].displayName = requestedChanges.displayName;
        if (approvedFields.email) db[userIndex].email = requestedChanges.email;
        if (approvedFields.role) db[userIndex].role = requestedChanges.role;
        localStorage.setItem("mock_users_db", JSON.stringify(db));
      }

      // 2. Update role_${userId} and role_${userEmail}
      if (approvedFields.role) {
        localStorage.setItem(`role_${userId}`, requestedChanges.role);
        localStorage.setItem(`role_${userEmail}`, requestedChanges.role);
      }

      // 3. Update profile_${userId} and profile_${userEmail}
      const profileKey = `profile_${userId}`;
      const profileKeyEmail = `profile_${userEmail}`;
      const oldProfile = JSON.parse(localStorage.getItem(profileKey) || localStorage.getItem(profileKeyEmail) || "{}");
      const newProfile = {
        ...oldProfile,
        ...(approvedFields.studentTutorId ? { studentTutorId: requestedChanges.studentTutorId } : {})
      };
      localStorage.setItem(profileKey, JSON.stringify(newProfile));
      localStorage.setItem(profileKeyEmail, JSON.stringify(newProfile));

      // 4. Update mock_user if active user
      const activeUser = JSON.parse(localStorage.getItem("mock_user") || "null");
      if (activeUser && (activeUser.uid === userId || activeUser.email.toLowerCase() === userEmail.toLowerCase())) {
        const updatedActive = {
          ...activeUser,
          ...(approvedFields.displayName ? { displayName: requestedChanges.displayName } : {}),
          ...(approvedFields.email ? { email: requestedChanges.email } : {}),
          ...(approvedFields.role ? { role: requestedChanges.role } : {}),
          ...newProfile
        };
        localStorage.setItem("mock_user", JSON.stringify(updatedActive));
      }

      // 5. Update request status
      const requests = JSON.parse(localStorage.getItem('profile_change_requests') || '[]');
      const updatedRequests = requests.map(r => {
        if (r.id === selectedRequest.id) {
          return { ...r, status: 'approved', approvedFields: approvedKeys };
        }
        return r;
      });
      localStorage.setItem('profile_change_requests', JSON.stringify(updatedRequests));

      toast.success(`Change request approved for: ${approvedKeys.join(', ')}`);
      setIsRequestModalOpen(false);
      setSelectedRequest(null);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve change request.");
    }
  };

  const handleDenyChangeRequest = (requestId) => {
    try {
      const requests = JSON.parse(localStorage.getItem('profile_change_requests') || '[]');
      const updatedRequests = requests.map(r => {
        if (r.id === requestId) {
          return { ...r, status: 'denied' };
        }
        return r;
      });
      localStorage.setItem('profile_change_requests', JSON.stringify(updatedRequests));

      toast.success("Profile change request has been denied.");
      setIsRequestModalOpen(false);
      setSelectedRequest(null);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deny change request.");
    }
  };

  // Actions: Tutor Application Review
  const openTutorAppReview = (app) => {
    setSelectedTutorApp(app);
    setIsTutorAppModalOpen(true);
  };

  const handleApproveTutorApplication = (app) => {
    try {
      const { userId, userEmail, userName, subjects, institution, price, bio } = app;

      // 1. Update mock_users_db
      const db = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
      const userIndex = db.findIndex(u => u.uid === userId || u.email.toLowerCase() === userEmail.toLowerCase());
      if (userIndex !== -1) {
        db[userIndex].role = 'tutor';
        localStorage.setItem("mock_users_db", JSON.stringify(db));
      }

      // 2. Update role flags
      localStorage.setItem(`role_${userId}`, 'tutor');
      localStorage.setItem(`role_${userEmail}`, 'tutor');

      // 3. Update profile details
      const profileKey = `profile_${userId}`;
      const profileKeyEmail = `profile_${userEmail}`;
      const oldProfile = JSON.parse(localStorage.getItem(profileKey) || localStorage.getItem(profileKeyEmail) || "{}");
      const newProfile = {
        ...oldProfile,
        role: 'tutor'
      };
      localStorage.setItem(profileKey, JSON.stringify(newProfile));
      localStorage.setItem(profileKeyEmail, JSON.stringify(newProfile));

      // 4. Update mock_user if active user
      const activeUser = JSON.parse(localStorage.getItem("mock_user") || "null");
      if (activeUser && (activeUser.uid === userId || activeUser.email.toLowerCase() === userEmail.toLowerCase())) {
        const updatedActive = {
          ...activeUser,
          role: 'tutor',
          ...newProfile
        };
        localStorage.setItem("mock_user", JSON.stringify(updatedActive));
      }

      // 5. Add to customTutors
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      const existingTutorIndex = customTutors.findIndex(t => t.email === userEmail);
      
      const targetPhoto = activeUser && activeUser.email.toLowerCase() === userEmail.toLowerCase() ? activeUser.photoURL : 
        (userIndex !== -1 ? db[userIndex].photoURL : "https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk");

      const tutorListing = {
        id: `tutor-custom-${userId || Math.random().toString(36).substr(2, 9)}`,
        name: userName,
        email: userEmail,
        subjects: subjects || [],
        institution: institution,
        price: price || 50,
        description: bio,
        image: targetPhoto,
        rating: 5.0,
        reviewsCount: 0,
        available: true,
        status: 'approved',
        isCustom: true
      };

      if (existingTutorIndex !== -1) {
        customTutors[existingTutorIndex] = {
          ...customTutors[existingTutorIndex],
          ...tutorListing,
          status: 'approved'
        };
      } else {
        customTutors.push(tutorListing);
      }
      localStorage.setItem('customTutors', JSON.stringify(customTutors));

      // 6. Update crm metadata
      const savedCrmMeta = localStorage.getItem('admin_tutors_crm');
      let crmMeta = savedCrmMeta ? JSON.parse(savedCrmMeta) : [];
      const metaIndex = crmMeta.findIndex(m => m.id === tutorListing.id);
      const newMeta = {
        id: tutorListing.id,
        workHoursLogged: 0,
        sessionsCompleted: 0,
        joinDate: new Date().toISOString().split('T')[0],
        contractEndDate: '2027-10-01',
        status: 'approved'
      };
      if (metaIndex !== -1) {
        crmMeta[metaIndex] = { ...crmMeta[metaIndex], status: 'approved' };
      } else {
        crmMeta.push(newMeta);
      }
      localStorage.setItem('admin_tutors_crm', JSON.stringify(crmMeta));

      // 7. Update status in tutor_applications
      const apps = JSON.parse(localStorage.getItem('tutor_applications') || '[]');
      const updatedApps = apps.map(a => {
        if (a.id === app.id) {
          return { ...a, status: 'approved' };
        }
        return a;
      });
      localStorage.setItem('tutor_applications', JSON.stringify(updatedApps));

      toast.success(`Approved ${userName} as a tutor!`);
      setIsTutorAppModalOpen(false);
      setSelectedTutorApp(null);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve tutor application.");
    }
  };

  const handleDenyTutorApplicationSubmit = (appId) => {
    try {
      const apps = JSON.parse(localStorage.getItem('tutor_applications') || '[]');
      const updatedApps = apps.map(a => {
        if (a.id === appId) {
          return { ...a, status: 'denied' };
        }
        return a;
      });
      localStorage.setItem('tutor_applications', JSON.stringify(updatedApps));

      toast.success("Tutor application has been denied.");
      setIsTutorAppModalOpen(false);
      setSelectedTutorApp(null);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deny tutor application.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-xs font-bold mb-3">
              System Operations CRM
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">MediQueue SaaS Portal</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage system metrics, students, instructors, and revenue ledger accounts.
            </p>
          </div>
          {stats.totalPendingApprovals > 0 && (
            <button
              onClick={() => setActiveTab('approvals')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 rounded-xl text-xs font-extrabold animate-pulse hover:bg-amber-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
              {stats.totalPendingApprovals} Pending Approval Requests
            </button>
          )}
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-outline-variant/30 dark:border-slate-700 pb-4">
          {[
            { id: 'analytics', label: 'Overall Analytics', icon: 'monitoring' },
            { id: 'students', label: 'Student Management', icon: 'school' },
            { id: 'tutors', label: 'Tutor Management', icon: 'groups' },
            { id: 'financials', label: 'Financials & Payments', icon: 'account_balance_wallet' },
            { id: 'approvals', label: 'Approval Queue & Requests', icon: 'rule', badge: stats.totalPendingApprovals }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 active:scale-95 relative ${
                activeTab === tab.id
                  ? 'bg-primary text-on-secondary shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERALL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Metric 1: Students */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Total Students</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalStudents}</span>
                </div>
              </div>

              {/* Metric 2: Tutors */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">groups</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Active Tutors</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalTutors}</span>
                </div>
              </div>

              {/* Metric 3: Profit */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">payments</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Net System Profit</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${stats.netProfit}</span>
                </div>
              </div>

              {/* Metric 4: Bookings */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Total Reservations</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalBookings}</span>
                </div>
              </div>

            </div>

            {/* Detailed Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Specialty coverage */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">pie_chart</span>
                  Specialty Coverage Share
                </h2>
                <div className="space-y-4">
                  {Object.entries(stats.subjectDistribution).map(([subject, count]) => {
                    const percentage = stats.totalTutors > 0 ? ((count / stats.totalTutors) * 100).toFixed(0) : 0;
                    return (
                      <div key={subject} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-700 dark:text-gray-200">{subject}</span>
                          <span className="text-primary dark:text-primary-fixed-dim">{count} Tutors ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 relative overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logs */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  Operational Logs
                </h2>
                
                <div className="space-y-4 text-[11px] leading-relaxed">
                  <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-outline-variant/30 dark:border-slate-700">
                    <span className="font-bold text-primary block mb-1">CRM Database Active</span>
                    <p className="text-gray-600 dark:text-gray-300">
                      Synchronized {students.length} students, {tutors.length} tutors, and {ledger.length} financial transactions with LocalStorage.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-outline-variant/30 dark:border-slate-700">
                    <span className="font-bold text-primary block mb-1">Approval Queue Enabled</span>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tutor registration verification holds custom applications as 'pending' prior to administrator status release.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT MANAGEMENT */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Student management header controls */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                Active Students Directory
              </h2>
              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="px-4 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold flex items-center gap-2 shadow hover:opacity-90 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Add Student Manually
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-extrabold border-b border-outline-variant/30 dark:border-slate-700">
                      <th className="px-6 py-4">Student Details</th>
                      <th className="px-6 py-4">Assigned Tutor</th>
                      <th className="px-6 py-4">Schedule Slots</th>
                      <th className="px-6 py-4">Performance Rate</th>
                      <th className="px-6 py-4">Tasks State</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                    {students.length > 0 ? (
                      students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</p>
                            <p className="text-gray-500 text-[10px]">{student.email}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                            {student.assignedTutor}
                          </td>
                          <td className="px-6 py-4">
                            <span className="block font-semibold text-gray-900 dark:text-gray-100">{student.scheduleDate}</span>
                            <span className="text-gray-500 text-[10px]">{student.scheduleTime}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded font-extrabold ${
                              student.performance.includes('Excellent')
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : student.performance.includes('Good')
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {student.performance}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              student.taskStatus === 'Completed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : student.taskStatus === 'In Progress'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {student.taskStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleBanStudent(student.id, student.name)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors inline-flex items-center gap-1 font-bold active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">block</span>
                              Ban
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-500 font-semibold">
                          No active students found in directory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manually Add Student Modal */}
            {isAddStudentOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">person_add</span>
                      Add New Student
                    </h2>
                    <button
                      onClick={() => setIsAddStudentOpen(false)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleAddStudentSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Student Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm text-gray-900 dark:text-white"
                        placeholder="Dr. Bruce Banner"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Student Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm text-gray-900 dark:text-white"
                        placeholder="bruce@hulk.edu"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Assign Medical Tutor</label>
                      <select
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white"
                        value={assignedTutor}
                        onChange={(e) => setAssignedTutor(e.target.value)}
                      >
                        {approvedTutors.map(t => (
                          <option key={t.id} value={t.name}>{t.name} ({t.subjects[0]})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Session Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Time Slot</label>
                        <select
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        >
                          <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                          <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                          <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Performance Rate</label>
                        <select
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none"
                          value={performance}
                          onChange={(e) => setPerformance(e.target.value)}
                        >
                          <option value="Excellent (95%)">Excellent (95%)</option>
                          <option value="Good (85%)">Good (85%)</option>
                          <option value="Needs Review (60%)">Needs Review (60%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Task State</label>
                        <select
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none"
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddStudentOpen(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow hover:opacity-95"
                      >
                        Save Student
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TUTOR MANAGEMENT */}
        {activeTab === 'tutors' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span>
              Medical Instructors CRM
            </h2>

            {/* Tutors Grid/Table */}
            <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-extrabold border-b border-outline-variant/30 dark:border-slate-700">
                      <th className="px-6 py-4">Tutor Profile</th>
                      <th className="px-6 py-4">Specialty Discipline</th>
                      <th className="px-6 py-4">Work Hours</th>
                      <th className="px-6 py-4">Sessions Done</th>
                      <th className="px-6 py-4">Join Date</th>
                      <th className="px-6 py-4">Contract End Date</th>
                      <th className="px-6 py-4">Verification Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                    {tutors.length > 0 ? (
                      tutors.map(tutor => (
                        <tr key={tutor.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                {tutor.image ? (
                                  <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
                                ) : (
                                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{tutor.name}</p>
                                <p className="text-gray-500 text-[10px]">{tutor.institution}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded font-semibold text-[10px]">
                              {tutor.subjects?.join(', ') || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                            {tutor.workHoursLogged} hrs
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                            {tutor.sessionsCompleted} sessions
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                            {tutor.joinDate}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                            {tutor.contractEndDate}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                              tutor.status === 'approved'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse'
                            }`}>
                              {tutor.status || 'approved'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center items-center">
                              {tutor.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveTutor(tutor.id, tutor.name)}
                                  className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all inline-flex items-center gap-1 font-bold active:scale-95 text-[10px]"
                                >
                                  <span className="material-symbols-outlined text-[14px]">done_all</span>
                                  Approve Role
                                </button>
                              )}
                              <button
                                onClick={() => handleBanTutor(tutor.id, tutor.name)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors inline-flex items-center gap-1 font-bold active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[16px]">block</span>
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-12 text-gray-500 font-semibold">
                          No active tutors found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIALS & PAYMENTS */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Ledger metrics overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">Total Inflow (Student Fees)</span>
                <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">+${stats.inflowTotal}</span>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">Total Outflow (Tutor Payouts)</span>
                <span className="text-2xl font-extrabold text-red-600 dark:text-red-400">-${stats.outflowTotal}</span>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">Net Earnings Margin</span>
                <span className="text-2xl font-extrabold text-primary dark:text-primary-fixed-dim">${stats.netProfit}</span>
              </div>
            </div>

            {/* Financial ledger actions header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                Unified Financial Ledger
              </h2>
              <button
                onClick={() => setIsAddTxOpen(true)}
                className="px-4 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold flex items-center gap-2 shadow hover:opacity-90 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                Record Transaction
              </button>
            </div>

            {/* Ledger Table */}
            <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-extrabold border-b border-outline-variant/30 dark:border-slate-700">
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Posting Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Cash Flow</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                    {ledger.length > 0 ? (
                      ledger.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">
                            {tx.id}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                            {tx.date}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">
                            {tx.description}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                              tx.type === 'inflow'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {tx.type === 'inflow' ? 'Student Fees' : 'Tutor Payout'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 font-extrabold text-sm ${
                            tx.type === 'inflow' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {tx.type === 'inflow' ? '+' : '-'}${tx.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[9px] ${
                              tx.status === 'Completed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : tx.status === 'Pending'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-500 font-semibold">
                          No transaction records listed.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Record Transaction Modal */}
            {isAddTxOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">receipt_long</span>
                      Record transaction
                    </h2>
                    <button
                      onClick={() => setIsAddTxOpen(false)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleAddTxSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Cash Flow Type</label>
                      <select
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white"
                        value={txType}
                        onChange={(e) => setTxType(e.target.value)}
                      >
                        <option value="inflow">Student Fees (Inflow +)</option>
                        <option value="outflow">Tutor Payout (Outflow -)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Transaction Description</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm text-gray-900 dark:text-white"
                        placeholder="e.g. Student Registration: John Doe"
                        value={txDesc}
                        onChange={(e) => setTxDesc(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Amount (USD)</label>
                        <input
                          type="number"
                          required
                          min="1"
                          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white"
                          placeholder="85"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Tx Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white"
                          value={txDate}
                          onChange={(e) => setTxDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Posting Status</label>
                      <select
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white"
                        value={txStatus}
                        onChange={(e) => setTxStatus(e.target.value)}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddTxOpen(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow hover:opacity-95"
                      >
                        Record Tx
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPROVAL QUEUE & REQUESTS (TAB E) */}
        {activeTab === 'approvals' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Subsection 1: Tutor Applications Approval Queue */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">engineering</span>
                Tutor Applications Approval Queue
              </h2>
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-extrabold border-b border-outline-variant/30 dark:border-slate-700">
                        <th className="px-6 py-4">Applicant Name</th>
                        <th className="px-6 py-4">Institution</th>
                        <th className="px-6 py-4">Subjects</th>
                        <th className="px-6 py-4">Rate (Hourly)</th>
                        <th className="px-6 py-4">Application Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                      {tutorApplications.length > 0 ? (
                        tutorApplications.map(app => (
                          <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{app.userName}</p>
                              <p className="text-gray-500 text-[10px]">{app.userEmail}</p>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                              {app.institution}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded font-semibold text-[10px]">
                                {app.subjects?.join(', ') || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                              ${app.price}/hr
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-semibold">
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                                app.status === 'approved'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : app.status === 'denied'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {app.status === 'pending' ? (
                                <button
                                  onClick={() => openTutorAppReview(app)}
                                  className="px-3 py-1.5 bg-primary text-on-secondary rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 text-[10px]"
                                >
                                  Review Application
                                </button>
                              ) : (
                                <span className="text-gray-400 font-medium text-[10px]">Reviewed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-10 text-gray-500 font-semibold">
                            No pending tutor applications.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Subsection 2: Identity Profile Change Requests */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">badge</span>
                Identity Profile Change Requests
              </h2>
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-extrabold border-b border-outline-variant/30 dark:border-slate-700">
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Current Info Summary</th>
                        <th className="px-6 py-4">Requested Updates</th>
                        <th className="px-6 py-4">Request Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                      {changeRequests.length > 0 ? (
                        changeRequests.map(req => {
                          const changesCount = Object.keys(req.requestedChanges).filter(
                            key => req.requestedChanges[key] !== req.oldValues[key]
                          ).length;

                          return (
                            <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{req.userName}</p>
                                <p className="text-gray-500 text-[10px]">{req.userEmail}</p>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                <p className="text-[10px]">Name: <span className="font-semibold">{req.oldValues.displayName || 'N/A'}</span></p>
                                <p className="text-[10px]">ID: <span className="font-semibold">{req.oldValues.studentTutorId || 'N/A'}</span></p>
                              </td>
                              <td className="px-6 py-4 font-bold text-primary dark:text-primary-fixed-dim">
                                {changesCount} proposed changes
                              </td>
                              <td className="px-6 py-4 text-gray-500 font-semibold">
                                {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                                  req.status === 'approved'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : req.status === 'denied'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {req.status === 'pending' ? (
                                  <button
                                    onClick={() => openRequestReview(req)}
                                    className="px-3 py-1.5 bg-primary text-on-secondary rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 text-[10px]"
                                  >
                                    Review & Approve
                                  </button>
                                ) : (
                                  <span className="text-gray-400 font-medium text-[10px]">Reviewed</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-10 text-gray-500 font-semibold">
                            No pending profile change requests.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Review Profile Change Request (Selective approvals) */}
        {isRequestModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="w-full max-w-[620px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">rate_review</span>
                    Review Identity Profile Changes
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Submitted by {selectedRequest.userName} ({selectedRequest.userEmail})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsRequestModalOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-500">close</span>
                </button>
              </div>

              <form onSubmit={handleApproveChangeRequestSubmit} className="space-y-6">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/30 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold border-b border-outline-variant/30 dark:border-slate-700">
                        <th className="px-4 py-3">Field Name</th>
                        <th className="px-4 py-3">Current Value</th>
                        <th className="px-4 py-3">Requested Update</th>
                        <th className="px-4 py-3 text-center">Approve?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-slate-800/80">
                      {[
                        { key: 'displayName', label: 'Full Name', oldVal: selectedRequest.oldValues.displayName, newVal: selectedRequest.requestedChanges.displayName },
                        { key: 'email', label: 'Email Address', oldVal: selectedRequest.oldValues.email, newVal: selectedRequest.requestedChanges.email },
                        { key: 'role', label: 'Account Role', oldVal: selectedRequest.oldValues.role, newVal: selectedRequest.requestedChanges.role },
                        { key: 'studentTutorId', label: 'Student/Tutor ID', oldVal: selectedRequest.oldValues.studentTutorId, newVal: selectedRequest.requestedChanges.studentTutorId }
                      ].map(field => {
                        const hasChanged = field.oldVal !== field.newVal;

                        return (
                          <tr key={field.key} className={hasChanged ? 'bg-amber-50/30 dark:bg-amber-950/10' : 'opacity-60'}>
                            <td className="px-4 py-3.5 font-bold text-gray-800 dark:text-gray-200">
                              {field.label}
                            </td>
                            <td className="px-4 py-3.5 text-red-600 dark:text-red-400 font-mono break-all max-w-[140px]">
                              {field.oldVal || '(Empty)'}
                            </td>
                            <td className={`px-4 py-3.5 font-mono break-all max-w-[160px] ${hasChanged ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500'}`}>
                              {field.newVal || '(Empty)'}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <input
                                type="checkbox"
                                disabled={!hasChanged}
                                checked={!!approvedFields[field.key]}
                                onChange={(e) => setApprovedFields({ ...approvedFields, [field.key]: e.target.checked })}
                                className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer disabled:cursor-not-allowed"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-outline-variant/30 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDenyChangeRequest(selectedRequest.id)}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 border border-red-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    Deny Full Request
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRequestModalOpen(false);
                        setSelectedRequest(null);
                      }}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow hover:opacity-95 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      Submit Decision
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Review Tutor Application */}
        {isTutorAppModalOpen && selectedTutorApp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="w-full max-w-[540px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">engineering</span>
                    Review Tutor Application
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Submitted by {selectedTutorApp.userName} on {new Date(selectedTutorApp.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsTutorAppModalOpen(false);
                    setSelectedTutorApp(null);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-500">close</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Side-by-side details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border border-outline-variant/30 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">APPLICANT EMAIL</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedTutorApp.userEmail}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border border-outline-variant/30 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">PROPOSED PRICE RATE</span>
                    <span className="font-bold text-primary dark:text-primary-fixed-dim">${selectedTutorApp.price}/hr</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border border-outline-variant/30 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">SPECIALTY SUBJECTS</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedTutorApp.subjects.join(', ')}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border border-outline-variant/30 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">MEDICAL INSTITUTION</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedTutorApp.institution}</span>
                  </div>
                </div>

                {/* Professional Bio Statement */}
                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border border-outline-variant/30 dark:border-slate-800 rounded-2xl text-xs space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 block">PROFESSIONAL BIO / STATEMENT</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{selectedTutorApp.bio}"
                  </p>
                </div>

                {/* Credentials file attachment */}
                <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 text-xs">
                  <div className="flex items-center gap-2 text-primary dark:text-primary-fixed-dim">
                    <span className="material-symbols-outlined">attachment</span>
                    <span className="font-bold">Medical Credentials Attachment</span>
                  </div>
                  <a
                    href={selectedTutorApp.credentialsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-800 font-extrabold border border-gray-200 rounded-xl transition-all shadow-sm flex items-center gap-1 active:scale-95 text-[10px]"
                  >
                    View Credential PDF
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30 dark:border-slate-800">
                  <button
                    onClick={() => handleDenyTutorApplicationSubmit(selectedTutorApp.id)}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-all active:scale-95 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    Deny Applicant
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsTutorAppModalOpen(false);
                        setSelectedTutorApp(null);
                      }}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApproveTutorApplication(selectedTutorApp)}
                      className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">done</span>
                      Approve & Promote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
