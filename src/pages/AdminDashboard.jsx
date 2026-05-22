import React, { useState, useEffect, useMemo } from 'react';
import { mockTutors } from '../data/mockTutors';
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
  const [bookings, setBookings] = useState([]);

  // Interactive Charts hover states
  const [hoveredRevenueIndex, setHoveredRevenueIndex] = useState(null);
  const [hoveredBookingIndex, setHoveredBookingIndex] = useState(null);

  // Form Modals states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddTutorOpen, setIsAddTutorOpen] = useState(false);

  // Tutor Form States
  const [tutorFullName, setTutorFullName] = useState('');
  const [tutorEmail, setTutorEmail] = useState('');
  const [tutorInstitution, setTutorInstitution] = useState('');
  const [tutorDesignation, setTutorDesignation] = useState('Dr.');
  const [tutorSelectedSubjects, setTutorSelectedSubjects] = useState([]);
  const [tutorPrice, setTutorPrice] = useState('');
  const [tutorDescription, setTutorDescription] = useState('');
  const [tutorImage, setTutorImage] = useState('');
  const [tutorGeneratedUserId, setTutorGeneratedUserId] = useState('');
  const [tutorGeneratedPassword, setTutorGeneratedPassword] = useState('');
  const [tutorIsSubmitting, setTutorIsSubmitting] = useState(false);

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

  // Student Search and Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [studentTutorFilter, setStudentTutorFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [studentPerformanceFilter, setStudentPerformanceFilter] = useState('all');

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

    // 6. Bookings
    let savedBookings = localStorage.getItem('bookings');
    if (!savedBookings) {
      const defaultBookings = [
        {
          bookingId: 'book-1',
          tutorId: 'tutor-1',
          tutorName: 'Dr. Sarah Johnson',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdffOm4FzYt5mQ3FTPrPiZd80rHNIKmTAH_gsfiPB8cHfyPk5XU8BIZsImafY0vys07CFjjH1Nnti9npsPPLR9eAe1Om6gLBYVZPaNXfOZ2ZqNLKxHg3YopK-L6T7Es_zwkCa4c5ZOBfdtxK8owUfr-iMqlU4vh1O4d6pROVtXaUC7RmioXnU7GzvCvnAEM-LMwamkKc4pmc6YzJX70U04rqkRqT3S2iglaa5hJu6G4BhPMcKU9ELubnHiGz63dLt6b97DrewVU_U',
          tutorInstitution: 'Johns Hopkins Medicine',
          price: 85,
          studentName: 'Emma Watson',
          studentEmail: 'emma.w@academy.edu',
          appointmentDate: '2026-05-25',
          appointmentTime: '10:00 AM - 11:00 AM',
          subject: 'Anatomy',
          note: 'Focused study on upper limbs anatomy and musculoskeletal paths.',
          bookedAt: '2026-05-18T10:00:00.000Z',
          status: 'Scheduled'
        },
        {
          bookingId: 'book-2',
          tutorId: 'tutor-2',
          tutorName: 'Alex Rivera',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUT-lUH9Xzcp4ImZhI9HvgpPzofHXv5Kur__rVyyro66_Z9o1pzbAUewou71j0yXiKgEZTBP7s54_XOPBGcUOBdFzy1o55drXwtts5IWVOdlTF2IhYYwSvpJZS5dTs6e_OwhlvMPy2eoYjseuG2B3lxZ4gwnhH0enVqQj2CvdgvhXNhSr2_coVn3fmcyi38Syu19mEL6oVpZWLR3zbnD1UO2jPpu-SqkDXQIFxaQKSTN9QbEgPaxQnikSuoQnBGgztwL2bqki1HhY',
          tutorInstitution: 'Mayo Clinic Alix School of Medicine',
          price: 65,
          studentName: 'Lucas Miller',
          studentEmail: 'lucas.m@medical.edu',
          appointmentDate: '2026-05-19',
          appointmentTime: '02:00 PM - 03:00 PM',
          subject: 'Cardiology',
          note: 'Need help interpreting challenging EKG strips and murmurs.',
          bookedAt: '2026-05-17T14:00:00.000Z',
          status: 'Completed'
        },
        {
          bookingId: 'book-3',
          tutorId: 'tutor-3',
          tutorName: 'Dr. Michael Chen',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMsvpRf2euKElhnl2Ivijp189mW7UjXC-lo5pR29grHVYFpADzfc435MUcyk52O3AOlqTToNbP9dWUH_R0F7zIXZxhZwom8EnRN8itFB22PPv32kIgK78XOGindM61BvsCwbHh_G_KxQ-w4ZgUuatya4ch6mQIaHrC8X6fYQk_8Ec2COGqQA_wjWCfiXsqGqID2rFLHiNZFAGFQMDld7BLbB2XlTHYKaRmKdAPrrvaqyAjqqnYu2BrH9ztQMlLYySCWurudWTHGGs',
          tutorInstitution: 'Harvard Medical School',
          price: 95,
          studentName: 'Sophia Chen',
          studentEmail: 'sophia.c@university.edu',
          appointmentDate: '2026-05-21',
          appointmentTime: '11:00 AM - 12:00 PM',
          subject: 'Neurology',
          note: 'Brief review of neuropathology slides before the exam.',
          bookedAt: '2026-05-16T11:00:00.000Z',
          status: 'Cancelled'
        },
        {
          bookingId: 'book-4',
          tutorId: 'tutor-4',
          tutorName: 'Jordan Smith',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk',
          tutorInstitution: 'Stanford University School of Medicine',
          price: 55,
          studentName: 'Emma Watson',
          studentEmail: 'emma.w@academy.edu',
          appointmentDate: '2026-05-15',
          appointmentTime: '04:00 PM - 05:00 PM',
          subject: 'Biochemistry',
          note: 'Glycolysis and Krebs cycle regulation questions.',
          bookedAt: '2026-05-14T16:00:00.000Z',
          status: 'Completed'
        },
        {
          bookingId: 'book-5',
          tutorId: 'tutor-5',
          tutorName: 'Dr. Emily Blunt',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTUWiFR0EtV_ArGCW8FkixIA1A0K4CSpfw3HsDrjVVtSQwIthlCURDOEY6UM_OkkTiNUt8bI-FLEHIDq8IFaZsLjRJ0_JYh5HsZg-KyNIqQsb8MnM4VNO7dmG8MKOkULrhXGnEoGWH18WTXbsiifg5em-LPQ90mQ5xLIVLYn0n_TPQi1B0OSlTjgo7VofbtHdMbys0DD1gwCfdP1DoSrfGUH_YyCRkDfwh9r21q4nb4e0KvLKp9P_Rw99xYt-p7dZk-XZ5eq2oI6g',
          tutorInstitution: 'Massachusetts General Hospital',
          price: 110,
          studentName: 'Lucas Miller',
          studentEmail: 'lucas.m@medical.edu',
          appointmentDate: '2026-05-27',
          appointmentTime: '09:00 AM - 10:00 AM',
          subject: 'OSCE',
          note: 'Mock OSCE exam with verbal communication feedback.',
          bookedAt: '2026-05-20T09:00:00.000Z',
          status: 'Scheduled'
        },
        {
          bookingId: 'book-6',
          tutorId: 'tutor-1',
          tutorName: 'Dr. Sarah Johnson',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdffOm4FzYt5mQ3FTPrPiZd80rHNIKmTAH_gsfiPB8cHfyPk5XU8BIZsImafY0vys07CFjjH1Nnti9npsPPLR9eAe1Om6gLBYVZPaNXfOZ2ZqNLKxHg3YopK-L6T7Es_zwkCa4c5ZOBfdtxK8owUfr-iMqlU4vh1O4d6pROVtXaUC7RmioXnU7GzvCvnAEM-LMwamkKc4pmc6YzJX70U04rqkRqT3S2iglaa5hJu6G4BhPMcKU9ELubnHiGz63dLt6b97DrewVU_U',
          tutorInstitution: 'Johns Hopkins Medicine',
          price: 85,
          studentName: 'Sophia Chen',
          studentEmail: 'sophia.c@university.edu',
          appointmentDate: '2026-05-20',
          appointmentTime: '01:00 PM - 02:00 PM',
          subject: 'Anatomy',
          note: 'Deep dive into thorax vascular structures.',
          bookedAt: '2026-05-18T13:00:00.000Z',
          status: 'Completed'
        },
        {
          bookingId: 'book-7',
          tutorId: 'tutor-2',
          tutorName: 'Alex Rivera',
          tutorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUT-lUH9Xzcp4ImZhI9HvgpPzofHXv5Kur__rVyyro66_Z9o1pzbAUewou71j0yXiKgEZTBP7s54_XOPBGcUOBdFzy1o55drXwtts5IWVOdlTF2IhYYwSvpJZS5dTs6e_OwhlvMPy2eoYjseuG2B3lxZ4gwnhH0enVqQj2CvdgvhXNhSr2_coVn3fmcyi38Syu19mEL6oVpZWLR3zbnD1UO2jPpu-SqkDXQIFxaQKSTN9QbEgPaxQnikSuoQnBGgztwL2bqki1HhY',
          tutorInstitution: 'Mayo Clinic Alix School of Medicine',
          price: 65,
          studentName: 'Emma Watson',
          studentEmail: 'emma.w@academy.edu',
          appointmentDate: '2026-05-22',
          appointmentTime: '11:00 AM - 12:00 PM',
          subject: 'Cardiology',
          note: 'EKG diagnostics review.',
          bookedAt: '2026-05-20T11:00:00.000Z',
          status: 'Cancelled'
        }
      ];
      localStorage.setItem('bookings', JSON.stringify(defaultBookings));
      savedBookings = JSON.stringify(defaultBookings);
    }
    setBookings(JSON.parse(savedBookings));
  };

  useEffect(() => {
    loadAllData();
  }, []);



  // Compute overall stats dynamically
  const stats = useMemo(() => {
    const totalTutors = tutors.length;
    const totalStudents = students.length;
    
    // Bookings count from bookings DB
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

    // Bookings breakdown
    const activeCount = bookings.filter(b => b.status === 'Scheduled').length;
    const completedCount = bookings.filter(b => b.status === 'Completed').length;
    const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
    const activeRatio = totalBookings > 0 ? Math.round((activeCount / totalBookings) * 100) : 0;
    const completedRatio = totalBookings > 0 ? Math.round((completedCount / totalBookings) * 100) : 0;
    const cancelledRatio = totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0;

    // Top Performing Specialty (based on bookings subject count)
    const bookingSubjects = {};
    bookings.forEach(b => {
      if (b.subject) {
        bookingSubjects[b.subject] = (bookingSubjects[b.subject] || 0) + 1;
      }
    });
    let topSpecialty = 'None';
    let topSpecialtyCount = 0;
    Object.entries(bookingSubjects).forEach(([subject, count]) => {
      if (count > topSpecialtyCount) {
        topSpecialtyCount = count;
        topSpecialty = subject;
      }
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
      totalPendingApprovals,
      topSpecialty,
      topSpecialtyCount,
      activeCount,
      completedCount,
      cancelledCount,
      activeRatio,
      completedRatio,
      cancelledRatio
    };
  }, [tutors, students, ledger, tutorApplications, changeRequests, bookings]);

  // Coordinates and data calculations for charts
  const monthlyRevenue = useMemo(() => {
    const baseRevenue = {
      '2025-12': 1200,
      '2026-01': 1450,
      '2026-02': 1100,
      '2026-03': 1650,
      '2026-04': 1900,
      '2026-05': 0
    };

    let mayInflow = 0;
    ledger.forEach(tx => {
      if (tx.type === 'inflow' && tx.status === 'Completed' && tx.date.startsWith('2026-05')) {
        mayInflow += tx.amount;
      }
    });
    baseRevenue['2026-05'] = 1500 + mayInflow;

    return [
      { month: 'Dec', revenue: baseRevenue['2025-12'] },
      { month: 'Jan', revenue: baseRevenue['2026-01'] },
      { month: 'Feb', revenue: baseRevenue['2026-02'] },
      { month: 'Mar', revenue: baseRevenue['2026-03'] },
      { month: 'Apr', revenue: baseRevenue['2026-04'] },
      { month: 'May', revenue: baseRevenue['2026-05'] },
    ];
  }, [ledger]);

  const revenueChartPoints = useMemo(() => {
    const maxVal = Math.max(...monthlyRevenue.map(d => d.revenue), 1);
    return monthlyRevenue.map((d, i) => {
      const x = 50 + i * (420 / 5);
      const y = 160 - (d.revenue / maxVal) * 110;
      return { ...d, x, y };
    });
  }, [monthlyRevenue]);

  const revenueLinePath = useMemo(() => {
    if (revenueChartPoints.length === 0) return '';
    let path = `M ${revenueChartPoints[0].x} ${revenueChartPoints[0].y}`;
    for (let i = 0; i < revenueChartPoints.length - 1; i++) {
      const p0 = revenueChartPoints[i];
      const p1 = revenueChartPoints[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  }, [revenueChartPoints]);

  const revenueAreaPath = useMemo(() => {
    if (revenueChartPoints.length === 0) return '';
    return `${revenueLinePath} L ${revenueChartPoints[revenueChartPoints.length - 1].x} 160 L ${revenueChartPoints[0].x} 160 Z`;
  }, [revenueChartPoints, revenueLinePath]);

  const dailyBookings = useMemo(() => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const refDate = new Date('2026-05-22T00:00:00');
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(refDate);
      d.setDate(refDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = `${weekdays[d.getDay()]} ${d.getDate()}`;
      
      const count = bookings.filter(b => b.appointmentDate === dateStr).length;
      
      days.push({
        date: dateStr,
        label,
        count: count + (i === 1 || i === 3 ? 1 : 0)
      });
    }
    return days;
  }, [bookings]);

  const bookingChartPoints = useMemo(() => {
    const maxVal = Math.max(...dailyBookings.map(d => d.count), 1);
    return dailyBookings.map((d, i) => {
      const x = 50 + i * (420 / 6);
      const height = (d.count / maxVal) * 110;
      const y = 160 - height;
      return { ...d, x, y, height, width: 32 };
    });
  }, [dailyBookings]);

  // Approved tutors list for selectors
  const approvedTutors = useMemo(() => {
    return tutors.filter(t => t.status === 'approved');
  }, [tutors]);

  // Student Search & Filter Computations
  const uniqueTutorsForFilter = useMemo(() => {
    const list = new Set();
    students.forEach(s => {
      if (s.assignedTutor) list.add(s.assignedTutor);
    });
    approvedTutors.forEach(t => {
      if (t.name) list.add(t.name);
    });
    return Array.from(list);
  }, [students, approvedTutors]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = studentSearch.toLowerCase();
      const matchesSearch = student.name.toLowerCase().includes(searchLower) ||
                            student.email.toLowerCase().includes(searchLower);
      
      const matchesTutor = studentTutorFilter === 'all' || student.assignedTutor === studentTutorFilter;
      const matchesStatus = studentStatusFilter === 'all' || student.taskStatus === studentStatusFilter;
      
      let matchesPerformance = true;
      if (studentPerformanceFilter !== 'all') {
        matchesPerformance = student.performance.toLowerCase().includes(studentPerformanceFilter.toLowerCase());
      }
      
      return matchesSearch && matchesTutor && matchesStatus && matchesPerformance;
    });
  }, [students, studentSearch, studentTutorFilter, studentStatusFilter, studentPerformanceFilter]);

  // Actions: Tutor CRM Manually Add
  const generateTutorTempCredentials = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const userId = `MQ-TUT-${randomNum}`;
    const password = `MQ-Temp-${randomStr}-${randomNum}!`;
    setTutorGeneratedUserId(userId);
    setTutorGeneratedPassword(password);
  };

  const toggleTutorSubject = (sub) => {
    if (tutorSelectedSubjects.includes(sub)) {
      setTutorSelectedSubjects(tutorSelectedSubjects.filter(s => s !== sub));
    } else {
      setTutorSelectedSubjects([...tutorSelectedSubjects, sub]);
    }
  };

  const handleAddTutorSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!tutorFullName.trim()) {
      toast.error('Please enter the full name.');
      return;
    }

    if (!tutorEmail.trim() || !tutorEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!tutorInstitution.trim()) {
      toast.error('Please specify the medical institution.');
      return;
    }

    if (tutorSelectedSubjects.length === 0) {
      toast.error('Please select at least one specialty discipline.');
      return;
    }

    if (!tutorPrice || parseFloat(tutorPrice) <= 0) {
      toast.error('Please enter a valid hourly rate greater than $0.');
      return;
    }

    if (tutorDescription.trim().length < 20) {
      toast.error('Please write a biography of at least 20 characters.');
      return;
    }

    try {
      setTutorIsSubmitting(true);

      const targetUid = `mock-uid-${Date.now()}`;
      
      // 1. Create registration user in mock_users_db
      const db = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
      
      // Avoid duplicate emails
      if (db.some(u => u.email.toLowerCase() === tutorEmail.trim().toLowerCase())) {
        toast.error('A user with this email already exists.');
        setTutorIsSubmitting(false);
        return;
      }

      const newUser = {
        uid: targetUid,
        email: tutorEmail.trim(),
        password: tutorGeneratedPassword,
        displayName: tutorFullName.trim(),
        photoURL: tutorImage.trim() || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk',
        role: 'tutor'
      };

      db.push(newUser);
      localStorage.setItem("mock_users_db", JSON.stringify(db));

      // 2. Set roles in localStorage
      localStorage.setItem(`role_${targetUid}`, 'tutor');
      localStorage.setItem(`role_${tutorEmail.trim()}`, 'tutor');

      // 3. Set profile details in localStorage
      const tutorProfile = {
        studentTutorId: tutorGeneratedUserId,
        institution: tutorInstitution.trim(),
        designation: tutorDesignation.trim(),
        subscriptionStatus: 'premium',
        age: 35
      };
      localStorage.setItem(`profile_${targetUid}`, JSON.stringify(tutorProfile));
      localStorage.setItem(`profile_${tutorEmail.trim()}`, JSON.stringify(tutorProfile));

      // 4. Create Tutor Listing in customTutors
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      const newTutorListing = {
        id: `tutor-custom-${targetUid}`,
        name: tutorFullName.trim(),
        email: tutorEmail.trim(),
        subjects: tutorSelectedSubjects,
        price: parseFloat(tutorPrice),
        description: tutorDescription.trim(),
        institution: tutorInstitution.trim(),
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
        setTutorIsSubmitting(false);
        toast.success(`Successfully registered Tutor ${tutorFullName}! Account created.`);
        setIsAddTutorOpen(false);

        // Reset form fields
        setTutorFullName('');
        setTutorEmail('');
        setTutorInstitution('');
        setTutorDesignation('Dr.');
        setTutorSelectedSubjects([]);
        setTutorPrice('');
        setTutorDescription('');
        setTutorImage('');
        
        loadAllData();
      }, 500);

    } catch (err) {
      console.error(err);
      toast.error('Failed to create listing. Please try again.');
      setTutorIsSubmitting(false);
    }
  };

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

              {/* Metric 5: Average Session Duration */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">pace</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Avg Session Duration</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">1.5 hrs</span>
                </div>
              </div>

              {/* Metric 6: Student Retention Rate */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">trending_up</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Student Retention</span>
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">87%</span>
                </div>
              </div>

              {/* Metric 7: Top Performing Specialty */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">psychology</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Top Specialty</span>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white block truncate">{stats.topSpecialty}</span>
                  <span className="text-[10px] text-gray-400 block font-semibold truncate">{stats.topSpecialtyCount} bookings</span>
                </div>
              </div>

              {/* Metric 8: Active Bookings ratio */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col justify-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">event_available</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Booking Status Ratios</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-250 block truncate">
                      Act: {stats.activeRatio}% | Comp: {stats.completedRatio}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${stats.activeRatio}%` }} title={`Active: ${stats.activeRatio}%`}></div>
                  <div className="bg-blue-500 h-full" style={{ width: `${stats.completedRatio}%` }} title={`Completed: ${stats.completedRatio}%`}></div>
                  <div className="bg-red-400 h-full" style={{ width: `${stats.cancelledRatio}%` }} title={`Cancelled: ${stats.cancelledRatio}%`}></div>
                </div>
              </div>

            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Chart A: Monthly Revenue Trend */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm relative">
                <div className="mb-4">
                  <span className="text-xs font-bold text-primary dark:text-primary-fixed-dim uppercase tracking-wider block">Financial Performance</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Revenue Trend</h3>
                </div>

                <div className="relative h-[200px] w-full">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#24389c" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#24389c" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="50" y1="50" x2="470" y2="50" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                    <line x1="50" y1="105" x2="470" y2="105" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                    <line x1="50" y1="160" x2="470" y2="160" stroke="#cbd5e1" className="dark:stroke-slate-600" />

                    {/* Y-Axis Labels */}
                    <text x="40" y="54" textAnchor="end" className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500">
                      ${Math.max(...monthlyRevenue.map(d => d.revenue), 1)}
                    </text>
                    <text x="40" y="109" textAnchor="end" className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500">
                      ${Math.round(Math.max(...monthlyRevenue.map(d => d.revenue), 1) / 2)}
                    </text>
                    <text x="40" y="164" textAnchor="end" className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500">
                      $0
                    </text>

                    {/* Area path */}
                    {revenueAreaPath && (
                      <path d={revenueAreaPath} fill="url(#revenueAreaGrad)" />
                    )}

                    {/* Curved line path */}
                    {revenueLinePath && (
                      <path d={revenueLinePath} fill="none" stroke="#24389c" strokeWidth="3" strokeLinecap="round" className="dark:stroke-primary-fixed-dim" />
                    )}

                    {/* Interactive points */}
                    {revenueChartPoints.map((point, idx) => (
                      <g key={idx}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={hoveredRevenueIndex === idx ? 8 : 4}
                          fill={hoveredRevenueIndex === idx ? '#ffffff' : '#24389c'}
                          stroke={hoveredRevenueIndex === idx ? '#24389c' : '#ffffff'}
                          strokeWidth={3}
                          className="transition-all duration-150 cursor-pointer dark:stroke-slate-800 dark:fill-primary-fixed-dim"
                          onMouseEnter={() => setHoveredRevenueIndex(idx)}
                          onMouseLeave={() => setHoveredRevenueIndex(null)}
                        />
                        {/* Large invisible hover target */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={20}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredRevenueIndex(idx)}
                          onMouseLeave={() => setHoveredRevenueIndex(null)}
                        />
                      </g>
                    ))}

                    {/* X-Axis Labels */}
                    {revenueChartPoints.map((point, idx) => (
                      <text
                        key={idx}
                        x={point.x}
                        y="185"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-gray-500 dark:fill-gray-400"
                      >
                        {point.month}
                      </text>
                    ))}
                  </svg>

                  {/* Absolute HTML Tooltip */}
                  {hoveredRevenueIndex !== null && (
                    <div
                      className="absolute bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl pointer-events-none border border-slate-700/80 z-20 flex flex-col font-bold animate-in fade-in duration-100"
                      style={{
                        left: `${(revenueChartPoints[hoveredRevenueIndex].x / 500) * 100}%`,
                        top: `${(revenueChartPoints[hoveredRevenueIndex].y / 200) * 100}%`,
                        transform: 'translate(-50%, -125%)'
                      }}
                    >
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{revenueChartPoints[hoveredRevenueIndex].month} 2026</span>
                      <span className="text-sm text-green-400 font-extrabold">${revenueChartPoints[hoveredRevenueIndex].revenue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart B: Daily Booking Volume */}
              <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm relative">
                <div className="mb-4">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider block">Activity Monitor</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Booking Volume</h3>
                </div>

                <div className="relative h-[200px] w-full">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="50" y1="50" x2="470" y2="50" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                    <line x1="50" y1="105" x2="470" y2="105" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                    <line x1="50" y1="160" x2="470" y2="160" stroke="#cbd5e1" className="dark:stroke-slate-600" />

                    {/* Y-Axis Labels */}
                    <text x="40" y="54" textAnchor="end" className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500">
                      {Math.max(...dailyBookings.map(d => d.count), 1)}
                    </text>
                    <text x="40" y="109" textAnchor="end" className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500">
                      {Math.round(Math.max(...dailyBookings.map(d => d.count), 1) / 2)}
                    </text>
                    <text x="40" y="164" textAnchor="end" className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500">
                      0
                    </text>

                    {/* Rectangular Bars */}
                    {bookingChartPoints.map((point, idx) => (
                      <rect
                        key={idx}
                        x={point.x - point.width / 2}
                        y={point.y}
                        width={point.width}
                        height={point.height}
                        rx="6"
                        ry="6"
                        fill={hoveredBookingIndex === idx ? '#008d9e' : '#006876'}
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredBookingIndex(idx)}
                        onMouseLeave={() => setHoveredBookingIndex(null)}
                      />
                    ))}

                    {/* X-Axis Labels */}
                    {bookingChartPoints.map((point, idx) => (
                      <text
                        key={idx}
                        x={point.x}
                        y="185"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-gray-500 dark:fill-gray-400"
                      >
                        {point.label.split(' ')[0]}
                      </text>
                    ))}
                  </svg>

                  {/* Absolute HTML Tooltip */}
                  {hoveredBookingIndex !== null && (
                    <div
                      className="absolute bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl pointer-events-none border border-slate-700/80 z-20 flex flex-col font-bold animate-in fade-in duration-100"
                      style={{
                        left: `${(bookingChartPoints[hoveredBookingIndex].x / 500) * 100}%`,
                        top: `${(bookingChartPoints[hoveredBookingIndex].y / 200) * 100}%`,
                        transform: 'translate(-50%, -125%)'
                      }}
                    >
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{bookingChartPoints[hoveredBookingIndex].label}</span>
                      <span className="text-sm text-cyan-400 font-extrabold">{bookingChartPoints[hoveredBookingIndex].count} Bookings</span>
                    </div>
                  )}
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
            {/* Search & Filter Panel */}
            <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Search Input */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-450 text-[18px]">search</span>
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-slate-900 border border-outline-variant/35 dark:border-slate-700 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/25"
                  />
                  {studentSearch && (
                    <button
                      type="button"
                      onClick={() => setStudentSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-200"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Tutor Filter */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-450 text-[18px]">person</span>
                  <select
                    value={studentTutorFilter}
                    onChange={(e) => setStudentTutorFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-slate-900 border border-outline-variant/35 dark:border-slate-700 rounded-2xl text-xs font-bold text-gray-800 dark:text-gray-205 outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                  >
                    <option value="all">All Tutors</option>
                    {uniqueTutorsForFilter.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 text-[18px] pointer-events-none">arrow_drop_down</span>
                </div>

                {/* Task Status Filter */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-450 text-[18px]">assignment_turned_in</span>
                  <select
                    value={studentStatusFilter}
                    onChange={(e) => setStudentStatusFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-slate-900 border border-outline-variant/35 dark:border-slate-700 rounded-2xl text-xs font-bold text-gray-800 dark:text-gray-205 outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                  >
                    <option value="all">All Task States</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 text-[18px] pointer-events-none">arrow_drop_down</span>
                </div>

                {/* Performance Filter */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-455 text-[18px]">trending_up</span>
                  <select
                    value={studentPerformanceFilter}
                    onChange={(e) => setStudentPerformanceFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-slate-900 border border-outline-variant/35 dark:border-slate-700 rounded-2xl text-xs font-bold text-gray-800 dark:text-gray-205 outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                  >
                    <option value="all">All Performances</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 text-[18px] pointer-events-none">arrow_drop_down</span>
                </div>

              </div>

              {/* Status Info Bar */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                <div>
                  Showing <span className="text-primary dark:text-primary-fixed-dim">{filteredStudents.length}</span> of {students.length} students
                </div>
                {(studentSearch || studentTutorFilter !== 'all' || studentStatusFilter !== 'all' || studentPerformanceFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setStudentSearch('');
                      setStudentTutorFilter('all');
                      setStudentStatusFilter('all');
                      setStudentPerformanceFilter('all');
                    }}
                    className="text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                    Reset Active Filters
                  </button>
                )}
              </div>
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
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">groups</span>
                Medical Instructors CRM
              </h2>
              <button
                onClick={() => {
                  generateTutorTempCredentials();
                  setIsAddTutorOpen(true);
                }}
                className="px-4 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold flex items-center gap-2 shadow hover:opacity-90 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Add Tutor Manually
              </button>
            </div>

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

        {/* MODAL: Manually Add Tutor */}
        {isAddTutorOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person_add</span>
                    Add Tutor Manually
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Create instructor account and generate clinical tutoring profile.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTutorOpen(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-500">close</span>
                </button>
              </div>

              <form onSubmit={handleAddTutorSubmit} className="space-y-4">
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
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-gray-900 dark:text-white"
                        value={tutorFullName}
                        onChange={(e) => setTutorFullName(e.target.value)}
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
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-gray-900 dark:text-white"
                        value={tutorEmail}
                        onChange={(e) => setTutorEmail(e.target.value)}
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
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-gray-900 dark:text-white"
                        value={tutorInstitution}
                        onChange={(e) => setTutorInstitution(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Academic Designation</label>
                    <select
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-xs font-semibold text-gray-900 dark:text-white cursor-pointer"
                      value={tutorDesignation}
                      onChange={(e) => setTutorDesignation(e.target.value)}
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
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-150 dark:border-slate-800">
                    {AVAILABLE_SUBJECTS.map((sub) => {
                      const isSelected = tutorSelectedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleTutorSubject(sub)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1 ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-750'
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
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-gray-900 dark:text-white"
                        value={tutorPrice}
                        onChange={(e) => setTutorPrice(e.target.value)}
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
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-gray-900 dark:text-white"
                        value={tutorImage}
                        onChange={(e) => setTutorImage(e.target.value)}
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
                    placeholder="Tell students about your medical background, teaching achievements (minimum 20 characters)..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-gray-900 dark:text-white"
                    value={tutorDescription}
                    onChange={(e) => setTutorDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Credential Generation Panel */}
                <div className="p-4 bg-gray-50 dark:bg-slate-850/60 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <h3 className="text-xs font-extrabold text-gray-750 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">key</span>
                    Generated Temp Credentials
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Tutor ID / User ID</label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-350 dark:border-slate-650 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 outline-none"
                          value={tutorGeneratedUserId}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(tutorGeneratedUserId);
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
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-350 dark:border-slate-650 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 outline-none"
                          value={tutorGeneratedPassword}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(tutorGeneratedPassword);
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
                    onClick={generateTutorTempCredentials}
                    className="text-[11px] text-primary dark:text-primary-fixed-dim hover:underline font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    Regenerate Credentials
                  </button>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddTutorOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-xl"
                    disabled={tutorIsSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow hover:opacity-95 flex items-center gap-1 disabled:opacity-50"
                    disabled={tutorIsSubmitting}
                  >
                    {tutorIsSubmitting ? 'Registering...' : 'Register Tutor'}
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
