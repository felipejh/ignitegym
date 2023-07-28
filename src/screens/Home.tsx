import { ReactElement, useState } from 'react'
import { VStack, HStack } from 'native-base'
import { Group, HomeHeader } from '@components'

function Home(): ReactElement {
  const [groupSelected, setGroupSelected] = useState('costas')

  return (
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
        <Group
          name="costas"
          isActive={groupSelected === 'costas'}
          onPress={() => setGroupSelected('costas')}
        />
        <Group
          name="ombro"
          isActive={groupSelected === 'ombro'}
          onPress={() => setGroupSelected('ombro')}
        />
      </HStack>
    </VStack>
  )
}

export default Home
