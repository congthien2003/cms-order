import Page from '@/components/ui/page';
import { Typography } from '@/components/ui/typography';
import { typographyVariants } from '@/components/ui/typography/typographyVariant';
import { Button } from '@/components/ui/button';
import {
  ButtonVariantClass,
  ButtonSizesClass,
} from '@/components/ui/button/buttonVariant';
import type { TypographyVariant } from '@/components/ui/typography/typography';
import { showSuccess } from '@/lib/toast';
import ReusableDialogExample from '@/components/ui/dialog/ReusableDialogExample';

function DemoPage() {
  // Lấy danh sách variant của Typography
  const typographyVariantKeys = Object.keys(typographyVariants);

  // Lấy danh sách variant và size của Button
  const buttonVariantKeys = Object.keys(ButtonVariantClass);
  const buttonSizeKeys = Object.keys(ButtonSizesClass);

  return (
    <Page title={'Demo page'}>
      <Button
        label="Toast"
        onClick={() => showSuccess('Hello')}
        variant="outline"
      />
      <ReusableDialogExample />
      <div className="space-y-12">
        {/* Typography demo */}
        <section>
          <Typography variant="h2-bold" className="mb-4 block">
            Typography Variants
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typographyVariantKeys.map((variant) => (
              <div key={variant} className="flex items-center space-x-4">
                <Typography variant={variant as TypographyVariant}>
                  {variant}
                </Typography>
                <span className="text-xs text-gray-400">({variant})</span>
              </div>
            ))}
          </div>
        </section>

        {/* Button demo */}
        <section>
          <Typography variant="h2-bold" className="mb-4 block">
            Button Variants
          </Typography>
          <div className="flex flex-wrap gap-4">
            {buttonVariantKeys.map((variant) => (
              <Button key={variant} variant={variant as any}>
                {variant}
              </Button>
            ))}
          </div>
          <Typography variant="h4-bold" className="mt-8 mb-2 block">
            Button Sizes
          </Typography>
          <div className="flex flex-wrap gap-4">
            {buttonSizeKeys.map((size) => (
              <Button key={size} variant="default" size={size as any}>
                {size}
              </Button>
            ))}
          </div>
          <Typography variant="h4-bold" className="mt-8 mb-2 block">
            Button Variant + Size
          </Typography>
          <div className="flex flex-wrap gap-4">
            {buttonVariantKeys.map((variant) =>
              buttonSizeKeys.map((size) => (
                <Button
                  key={`${variant}-${size}`}
                  variant={variant as any}
                  size={size as any}
                >
                  {variant} - {size}
                </Button>
              ))
            )}
          </div>
        </section>
      </div>
    </Page>
  );
}

export default DemoPage;
