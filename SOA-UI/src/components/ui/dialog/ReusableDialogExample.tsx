import React, { useState } from 'react';
import CustomDialog from './CustomDialog';
import Button from '@/components/ui/button/button';
import { showSuccess, showInfo } from '@/lib/toast';

export const ReusableDialogExample: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = async () => {
    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      showSuccess('Form submitted successfully!');
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', email: '' });
    showInfo('Dialog closed');
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">ReusableDialog Examples</h2>

      <div className="space-y-4">
        {/* Basic Dialog */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Dialog</h3>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open Basic Dialog
          </Button>

          <CustomDialog
            open={open}
            onOpenChange={setOpen}
            title="Basic Dialog"
            description="This is a basic dialog with close and submit buttons"
            isClose={true}
            isSubmit={true}
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitLoading={loading}
          >
            <div className="space-y-4">
              <p>
                This is the dialog content. You can put any React components
                here.
              </p>
              <div className="grid gap-3">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid gap-3">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </CustomDialog>
        </div>

        {/* Dialog with custom buttons */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-2">Custom Buttons</h3>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open Custom Dialog
          </Button>

          <ReusableDialog
            open={open}
            onOpenChange={setOpen}
            title="Custom Buttons"
            description="Dialog with custom button text and variants"
            isClose={true}
            isSubmit={true}
            closeText="Go Back"
            submitText="Save Changes"
            submitVariant="destructive"
            closeVariant="secondary"
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitLoading={loading}
            size="lg"
          >
            <div className="space-y-4">
              <p>This dialog has custom button text and styling.</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Custom button text</li>
                  <li>• Different button variants</li>
                  <li>• Larger dialog size</li>
                  <li>• Loading state on submit</li>
                </ul>
              </div>
            </div>
          </ReusableDialog>
        </div> */}

        {/* Dialog without close button */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-2">No Close Button</h3>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open Dialog (No Close)
          </Button>

          <ReusableDialog
            open={open}
            onOpenChange={setOpen}
            title="No Close Button"
            description="This dialog doesn't have a close button in header"
            isClose={false}
            isSubmit={true}
            submitText="Confirm"
            showCloseButton={false}
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitLoading={loading}
            size="sm"
          >
            <div className="text-center py-4">
              <p>This dialog doesn't have a close button in the header.</p>
              <p className="text-sm text-gray-500 mt-2">
                Users can only close it by clicking the submit button or
                pressing Escape.
              </p>
            </div>
          </ReusableDialog>
        </div> */}

        {/* Dialog with form validation */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-2">With Validation</h3>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open Validation Dialog
          </Button>

          <ReusableDialog
            open={open}
            onOpenChange={setOpen}
            title="Form Validation"
            description="Dialog with form validation and disabled submit"
            isClose={true}
            isSubmit={true}
            submitText="Save"
            submitDisabled={!formData.name || !formData.email}
            onClose={handleClose}
            onSubmit={handleSubmit}
            submitLoading={loading}
          >
            <div className="space-y-4">
              <p>Fill in both fields to enable the submit button.</p>
              <div className="grid gap-3">
                <label className="text-sm font-medium">
                  Name{' '}
                  {!formData.name && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid gap-3">
                <label className="text-sm font-medium">
                  Email{' '}
                  {!formData.email && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </ReusableDialog>
        </div> */}
      </div>
    </div>
  );
};

export default ReusableDialogExample;
