import { useState, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Camera,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Shield,
  User as UserIcon,
  Edit2,
  Check,
  X,
} from 'lucide-react';
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
        <Loader2 className="w-10 h-10 animate-spin text-[#367005]" />
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

  const isAdmin = profile?.roles?.includes(Role.ADMIN);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Banner Area */}
      <div className="relative h-64 rounded-b-[2rem] lg:rounded-[2rem] overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2e6303] via-[#367005] to-[#4b940a]"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="px-4 sm:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
          {/* Header section with Avatar overlapping */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-20 sm:-mt-24 mb-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-lg bg-white">
                <AvatarImage src={profile?.avatar} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#4b940a] to-[#2e6303] text-white text-4xl font-bold">
                  {profile?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-2 right-2 p-3 bg-white text-[#367005] rounded-full shadow-lg hover:scale-110 hover:bg-[#f3f9f0] transition-all disabled:opacity-50 border border-gray-100"
                title="Thay đổi ảnh đại diện"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
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

            <div className="flex-1 text-center sm:text-left space-y-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 font-serif">
                  {profile?.fullName || user?.username}
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#2e6303] to-[#4b940a] text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                    <Shield className="w-3 h-3" /> Quản trị viên
                  </span>
                )}
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                <UserIcon className="w-4 h-4" /> @{profile?.username}
              </p>
            </div>

            <div className="pb-2">
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-[#2e6303] to-[#4b940a] hover:from-[#367005] hover:to-[#55ad0f] text-white shadow-md hover:shadow-lg transition-all rounded-full px-6"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </div>
          </div>

          <hr className="border-gray-100 my-8" />

          {/* User Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Display / Edit Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-serif flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#367005]" />
                Thông tin cá nhân
              </h3>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="group">
                  <Label
                    htmlFor="fullName"
                    className="text-gray-500 text-sm mb-1.5 flex items-center gap-2"
                  >
                    Họ và tên
                  </Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Nhập họ và tên"
                      className="border-gray-300 focus-visible:ring-[#367005] focus-visible:border-[#367005] rounded-xl transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg px-1 py-1 rounded group-hover:bg-gray-50 transition-colors">
                      {profile?.fullName || (
                        <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <Label
                    htmlFor="phone"
                    className="text-gray-500 text-sm mb-1.5 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Số điện thoại
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại"
                      className="border-gray-300 focus-visible:ring-[#367005] focus-visible:border-[#367005] rounded-xl transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg px-1 py-1 rounded group-hover:bg-gray-50 transition-colors">
                      {profile?.phone || (
                        <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="group">
                  <Label
                    htmlFor="address"
                    className="text-gray-500 text-sm mb-1.5 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> Địa chỉ
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder="Nhập địa chỉ"
                      className="border-gray-300 focus-visible:ring-[#367005] focus-visible:border-[#367005] rounded-xl transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg px-1 py-1 rounded group-hover:bg-gray-50 transition-colors">
                      {profile?.address || (
                        <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#2e6303] to-[#4b940a] hover:from-[#367005] hover:to-[#55ad0f] text-white shadow-md hover:shadow-lg rounded-xl h-12 text-base transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Check className="w-5 h-5 mr-2" />
                    )}
                    Lưu thay đổi
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-12 text-base transition-all"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Hủy bỏ
                  </Button>
                </div>
              )}
            </div>

            {/* Read-only / Account Info Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-serif flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#367005]" />
                Tài khoản & Bảo mật
              </h3>

              <div className="bg-[#f9fafb] p-6 rounded-2xl border border-gray-100 space-y-5">
                <div>
                  <Label className="text-gray-500 text-sm mb-1.5 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Địa chỉ Email
                  </Label>
                  <p className="text-gray-900 font-medium text-lg">{profile?.email}</p>
                  <p className="text-xs text-[#367005] font-semibold mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Đã xác thực
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-gray-500 text-sm mb-1.5 block">
                    Vai trò trên hệ thống
                  </Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {profile?.roles?.map((r) => (
                      <span
                        key={r}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg font-medium shadow-sm"
                      >
                        {r === Role.ADMIN ? 'Quản trị viên' : r === Role.USER ? 'Người dùng' : r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-gray-500 text-sm mb-1.5 block">Ngày tham gia</Label>
                  <p className="text-gray-700 font-medium">Thành viên từ 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
