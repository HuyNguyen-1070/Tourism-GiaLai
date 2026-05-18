import { useState, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/components/common/ToastNotification';
import { Role } from '@/types/auth';

export const ProfilePage = () => {
  const { profile, loading, updateProfile, updateAvatar } = useProfile();
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-forest-leaf" />
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ảnh không được vượt quá 5MB', 'error');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Chỉ chấp nhận file JPG, JPEG, PNG', 'error');
      return;
    }
    setUploadingAvatar(true);
    await updateAvatar(file);
    setUploadingAvatar(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-l-4 border-forest-leaf pl-6">
        <h1 className="font-headline-lg text-headline-lg text-basalt-soil">Hồ sơ của tôi</h1>
        <p className="text-on-surface-variant mt-2">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-mist-beige shadow-sm">
              <AvatarImage src={profile?.avatar} />
              <AvatarFallback className="bg-primary-fixed text-on-primary-fixed text-2xl">
                {profile?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-1.5 bg-forest-leaf rounded-full text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-headline-md text-headline-md text-primary">
              {profile?.fullName || user?.username}
            </h2>
            <p className="text-on-surface-variant">@{profile?.username}</p>
            <p className="text-label-sm text-outline mt-1">{profile?.email}</p>
          </div>
        </div>

        {/* Information Form */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-primary">Thông tin chi tiết</h3>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-forest-leaf text-forest-leaf"
              >
                Chỉnh sửa
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <p className="mt-1 text-on-surface">
                  {profile?.fullName || <span className="text-outline italic">Chưa cập nhật</span>}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <p className="mt-1 text-on-surface">
                  {profile?.phone || <span className="text-outline italic">Chưa cập nhật</span>}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <p className="mt-1 text-on-surface">
                  {profile?.address || <span className="text-outline italic">Chưa cập nhật</span>}
                </p>
              )}
            </div>

            <div>
              <Label>Vai trò</Label>
              <p className="mt-1">
                {profile?.roles?.includes(Role.ADMIN) ? (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-primary-container text-on-primary-container text-label-sm">
                    Quản trị viên
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-surface-container text-on-surface-variant text-label-sm">
                    Người dùng
                  </span>
                )}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading} className="bg-forest-leaf">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Lưu thay đổi
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
