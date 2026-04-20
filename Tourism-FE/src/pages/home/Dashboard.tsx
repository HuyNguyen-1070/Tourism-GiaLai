import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800">Chào mừng, {user?.username}!</h1>
        <p className="text-gray-600 mt-2">Vai trò: {user?.role}</p>
        <div className="mt-8">
          <Button variant="secondary" onClick={logoutUser}>
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
};
