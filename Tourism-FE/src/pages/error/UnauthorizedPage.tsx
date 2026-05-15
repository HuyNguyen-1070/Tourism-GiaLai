import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mist-beige">
      <div className="text-center space-y-4">
        <h1 className="font-headline-xl text-headline-xl text-error">403</h1>
        <h2 className="font-headline-lg text-headline-lg text-basalt-soil">Truy cập bị từ chối</h2>
        <p className="text-on-surface-variant max-w-md">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
          <Link to="/login">
            <Button className="bg-forest-leaf">Đăng nhập lại</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
