import OfficeDetail, {
  getServerSideProps as getServerSidePropsOffice,
} from 'src/pages/offices/[id]';

export default OfficeDetail;

export const getServerSideProps = getServerSidePropsOffice;
