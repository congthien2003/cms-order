import { Save, Loader2, Store, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UpdateShopSettingsRequest } from '@/models/pos';

type SettingsFormProps = {
  formData: UpdateShopSettingsRequest;
  onFieldChange: <K extends keyof UpdateShopSettingsRequest>(
    field: K,
    value: UpdateShopSettingsRequest[K]
  ) => void;
  onSave: () => void;
  saving: boolean;
};

const SettingsForm = ({
  formData,
  onFieldChange,
  onSave,
  saving,
}: SettingsFormProps) => {
  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Quản lý cài đặt cửa hàng</p>
        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Shop Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Thông tin cửa hàng</CardTitle>
            </div>
            <CardDescription>
              Thông tin cơ bản về cửa hàng của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shopName">Tên cửa hàng</Label>
                <Input
                  id="shopName"
                  value={formData.shopName || ''}
                  onChange={(e) => onFieldChange('shopName', e.target.value)}
                  placeholder="Coffee Shop"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
                  placeholder="0123 456 789"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
                placeholder="123 Đường ABC, Quận XYZ"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Giờ hoạt động</CardTitle>
            </div>
            <CardDescription>Thiết lập giờ mở cửa và đóng cửa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Trạng thái cửa hàng</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isOpen
                    ? 'Cửa hàng đang mở cửa'
                    : 'Cửa hàng đang đóng cửa'}
                </p>
              </div>
              <Switch
                checked={formData.isOpen || false}
                onCheckedChange={(checked) => onFieldChange('isOpen', checked)}
              />
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="openTime">Giờ mở cửa</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={formData.openTime || ''}
                  onChange={(e) => onFieldChange('openTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={formData.closeTime || ''}
                  onChange={(e) => onFieldChange('closeTime', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees & Tax */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Phí & Thuế</CardTitle>
            </div>
            <CardDescription>Cài đặt các loại phí và thuế</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Thuế (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={formData.taxRate || 0}
                  onChange={(e) =>
                    onFieldChange('taxRate', parseFloat(e.target.value) || 0)
                  }
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceFee">Phí dịch vụ (%)</Label>
                <Input
                  id="serviceFee"
                  type="number"
                  step="0.1"
                  value={formData.serviceFee || 0}
                  onChange={(e) =>
                    onFieldChange('serviceFee', parseFloat(e.target.value) || 0)
                  }
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                <Input
                  id="currency"
                  value={formData.currency || 'VND'}
                  onChange={(e) => onFieldChange('currency', e.target.value)}
                  placeholder="VND"
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsForm;
