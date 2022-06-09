import QuestDetail, {
  getServerSideProps as getServerSidePropsOffice,
} from 'src/pages/offices/[id]/quests';

export default QuestDetail;

export const getServerSideProps = getServerSidePropsOffice;
