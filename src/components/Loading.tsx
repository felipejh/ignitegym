import { ReactElement } from 'react'
import { Center, Spinner } from 'native-base'

function Loading(): ReactElement {
  return (
    <Center flex={1} bgColor="gray.700">
      <Spinner color="green.500" />
    </Center>
  )
}

export default Loading
