import Typography from '../typography/typography';

type Props = {
  title: string;
  children?: React.ReactNode;
};

function Page({ title, children }: Props) {
  return (
    <>
      <Typography children={title} variant="h4-bold" />
      <div>{children}</div>
    </>
  );
}

export default Page;
