import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';
import { StudentRoute } from 'src/middleware/student-route';
import { getUploadUrl } from 'src/utils/user';
import { useGetApi } from 'src/utils/api';
import Image from 'next/image';

const ProfileDetail = () => {
  const [profile, setProfile] = useState();
  const router = useRouter();
  const auth = useRecoilValue(authState);

  useEffect(async () => {
    if (router.query.id === 'my') {
      setProfile(auth);
      return;
    }

    //
    const { data, error } = await useGetApi('user/' + router.query.id);

    setProfile(data);
  }, []);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>ID: {profile._id}</p>
      <p>
        {profile.firstName} {profile.lastName}
      </p>

      {profile.profileUrl && (
        <Image src={profile.profileUrl} width={100} height={100} />
      )}

      <p>{profile.role}</p>
      <p>{profile.student.officesCompleted.join(',')}</p>
    </div>
  );
};

export default ProfileDetail;

export const getServerSideProps = StudentRoute();
