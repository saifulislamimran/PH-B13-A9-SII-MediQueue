import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title ? `${title} | MediQueue` : 'MediQueue | Precision Medical Tutoring';
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
}
