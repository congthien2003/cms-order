import { Loader2 } from 'lucide-react';
import Page from '@/components/ui/page';
import { useSettings, SettingsForm } from '@/features/settings';

export default function SettingsPage() {
  const { loading, saving, formData, updateSettings, updateFormField } =
    useSettings();

  const handleSave = async () => {
    await updateSettings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Page title="Cài đặt">
      <SettingsForm
        formData={formData}
        onFieldChange={updateFormField}
        onSave={handleSave}
        saving={saving}
      />
    </Page>
  );
}
