import { ReactElement } from 'react'
import { Center, Heading } from 'native-base'

type ScreenHeaderProps = {
  title: string
}

function ScreenHeader({ title }: ScreenHeaderProps): ReactElement {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading color="gray.100" fontSize="xl">
        {title}
      </Heading>
    </Center>
  )
}

export default ScreenHeader