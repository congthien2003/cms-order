import { LockKeyhole } from 'lucide-react';

type Props = {
  width: string;
  height: string;
  classStyle: string;
};

function EditIcon({ width, height, classStyle }: Props) {
  return (
    <LockKeyhole
      style={{
        width: width,
        height: height,
      }}
      className={classStyle}
    />
  );
}

export default EditIcon;
