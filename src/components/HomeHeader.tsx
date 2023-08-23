import { ReactElement } from 'react'
import { HStack, Heading, Text, VStack, Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

import { UserPhoto } from '@components'
import { TouchableOpacity } from 'react-native'
import { useAuth } from '@hooks/useAuth'

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

function HomeHeader(): ReactElement {
  const {
    user: { name, avatar },
  } = useAuth()

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        size={16}
        source={avatar ? { uri: avatar } : defaultUserPhotoImg}
        alt="Imagem do usuário"
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {name}
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}

export default HomeHeader
