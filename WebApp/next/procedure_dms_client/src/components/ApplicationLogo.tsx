import Image from 'next/image';
import veleriLogo from '@/images/veleri-DMS-logo-horizontal.png'; // Adjust the path as necessary

const ApplicationLogo = ({ ...props }) => (
  <Image
    src={veleriLogo}
    alt="Application Logo"
    width={250}
    height={100}
    {...props}
  />
);

export default ApplicationLogo;
