import { useSelector } from 'react-redux';

const Notification = () => {
  const { type, message } = useSelector((state) => state.notification);

  if (message === null) return null;

  const baseClasses =
    'fixed top-4 right-4 z-50 rounded-md p-4 shadow-lg max-w-md transform transition-all duration-300 ease-in-out';
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Notification;
