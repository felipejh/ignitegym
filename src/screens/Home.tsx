import { ReactElement } from 'react';
import { Center, Text } from 'native-base'

function Home(): ReactElement {
  return (
    <Center flex={1}>
      <Text color="white">Home</Text>
    </Center>
  )
}

export default Home