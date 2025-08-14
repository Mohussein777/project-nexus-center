
import { MainLayout } from '../components/layout/MainLayout';
import { ClockifyAttendance } from '../components/employees/ClockifyAttendance';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const EmployeeAttendance = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <ClockifyAttendance />
    </MainLayout>
  );
};

export default EmployeeAttendance;
