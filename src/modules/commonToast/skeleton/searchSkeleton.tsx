import { Avatar, Box, Card, Skeleton, Typography } from '@mui/material';
import React from 'react'

interface isConfirmationMediaCard {
  listsToRender: any
}

const SearchSkeleton: React.FC<isConfirmationMediaCard> = ({ listsToRender }) => {
  return (
    <>
      {Array(listsToRender)
        .fill(1)
        .map((card, index) => (
          <Card key={index}>
            <Box display={'flex'} alignItems={'center'} p={3}>
              <Box>
                <Skeleton variant="circular">
                  <Avatar />
                </Skeleton>
              </Box>
              <Box px={4} width={'100%'}>
                <Skeleton width={'80%'}>
                  <Typography className='reem-kulfi search-name'>.</Typography>
                </Skeleton>
                <Skeleton width={'40%'}>
                  <Typography className='reem-kulfi search-name'>.</Typography>
                </Skeleton>
              </Box>
            </Box>
          </Card>
        ))}
    </>
  );
};

export default SearchSkeleton