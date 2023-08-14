import { ReactElement, useState } from 'react'
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from 'native-base'
import { Button, Input, ScreenHeader, UserPhoto } from '@components'
import { TouchableOpacity } from 'react-native'

const PHOTO_SIZE = 33

function Profile(): ReactElement {
  const [photoIsLoading, setPhotoIsLoading] = useState(true)

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView
        px={10}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <Center mt={6}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{ uri: 'https://github.com/felipejh.png' }}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input bg="gray.600" placeholder="Nome" />
          <Input bg="gray.600" placeholder="E-mail" isDisabled />
        </Center>

        <Heading
          color="gray.200"
          fontSize="md"
          mb={2}
          mt={12}
          alignSelf="flex-start"
        >
          Alterar senha
        </Heading>

        <Input bg="gray.600" placeholder="Senha atual" secureTextEntry />
        <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />
        <Input
          bg="gray.600"
          placeholder="Confirme a nova senha"
          secureTextEntry
        />

        <Button title="Atualizar" mt={4} />
      </ScrollView>
    </VStack>
  )
}

export default Profile
