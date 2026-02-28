import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/routeConfig';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToDashboard = () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    switch(user.role) {
      case 'student':
        navigate(ROUTES.STUDENT_DASHBOARD);
        break;
      case 'staff':
        navigate(ROUTES.STAFF_DASHBOARD);
        break;
      case 'admin':
        navigate(ROUTES.ADMIN_DASHBOARD);
        break;
      default:
        navigate(ROUTES.LOGIN);
    }
  };

  const goToComplaintDetails = (complaintId, role) => {
    switch(role) {
      case 'student':
        navigate(ROUTES.STUDENT_COMPLAINT_DETAIL.replace(':id', complaintId));
        break;
      case 'staff':
        navigate(ROUTES.STAFF_COMPLAINT_DETAIL.replace(':id', complaintId));
        break;
      case 'admin':
        navigate(ROUTES.ADMIN_COMPLAINTS, { state: { complaintId } });
        break;
      default:
        navigate(ROUTES.LOGIN);
    }
  };

  return {
    goToDashboard,
    goToComplaintDetails,
    navigate
  };
};