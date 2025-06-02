import React from 'react'
import Layout from './StudentsPageLayout';
import UploadPage from './UploadPage';
import ViewRecords from './ViewRecords';
import { useState } from 'react';
import FacultyLayout from './FacultyLayout';

const Students = () => {
  const [activeView, setActiveView] = useState('upload');

  return (
    <FacultyLayout>
        <Layout activeView={activeView} onViewChange={setActiveView}>
            {activeView === 'upload' ? <UploadPage /> : <ViewRecords />}
        </Layout>
    </FacultyLayout>
  );
}

export default Students