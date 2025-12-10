import { LockOpen } from 'lucide-react';

type Props = {
  width: string;
  height: string;
  classStyle: string;
};

function LockOpenIcon({ width, height, classStyle }: Props) {
  return (
    <LockOpen
      style={{
        width: width,
        height: height,
      }}
      className={classStyle}
    />
  );
}

export default LockOpenIcon;
