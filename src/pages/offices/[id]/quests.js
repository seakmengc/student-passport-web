import { Grid } from '@mui/material';
import { Radio } from '@nextui-org/react';
import React from 'react';
import { StudentRoute } from 'src/middleware/student-route';
import { useGetApi } from 'src/utils/api';
import { ssrGetToken } from 'src/utils/ssr';

//TODO: finish
const Quests = ({ quests }) => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  return (
    <div>
      <Grid container spacing={2}>
        <Radio.Group size='sm' orientation='horizontal'>
          {sizes.map((size) => (
            <Radio key={size} value={size}>
              {size}
            </Radio>
          ))}
        </Radio.Group>
      </Grid>
    </div>
  );
};

export default Quests;

export const getServerSideProps = StudentRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const [quests, latestQuest] = await Promise.all([
    useGetApi('quest/office/' + ctx.params.id, {}, accessToken),
    useGetApi(
      'student-quest/office/' + ctx.params.id + '/latest',
      {},
      accessToken
    ),
  ]);

  console.log(quests, latestQuest);

  return {
    props: { quests: quests.data, latest: latestQuest.data },
  };
});
