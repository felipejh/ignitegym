import { ReactElement, useState } from 'react'
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'

import { Button, Input, ScreenHeader, UserPhoto } from '@components'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

const PHOTO_SIZE = 33

type FormValues = {
  name: string
  email: string
  password: string | undefined | null
  old_password: string | undefined
  confirm_password: string | undefined | null
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos')
    .nullable()
    .transform(value => value || null),
  confirm_password: yup
    .string()
    .nullable()
    .transform(value => value || null)
    .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere')
    .when('password', {
      is: (Field: any) => Field,
      then: schema =>
        schema
          .nullable()
          .required('Informe a confirmação da senha')
          .transform(value => value || null),
    }),
  old_password: yup.string(),
})

function Profile(): ReactElement {
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const handleUserPhotoSelect = async (): Promise<void> => {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
          return
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const { data } = await api.patch('users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        const userUpdated = user
        userUpdated.avatar = data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500',
        })
      }
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao atualizar os dados.'

      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  const handleProfileUpdate = async (formValues: FormValues): Promise<void> => {
    try {
      setIsUpdating(true)

      await api.put(`users`, formValues)

      const userUpdated = user
      userUpdated.name = formValues.name
      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso.',
        placement: 'top',
        bgColor: 'green.700',
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao atualizar os dados.'

      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    } finally {
      setIsUpdating(false)
    }
  }

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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Center>

        <Heading
          color="gray.200"
          fontSize="md"
          mb={2}
          mt={12}
          alignSelf="flex-start"
          fontFamily="heading"
        >
          Alterar senha
        </Heading>

        <Controller
          control={control}
          name="old_password"
          render={({ field: { onChange } }) => (
            <Input
              bg="gray.600"
              placeholder="Senha atual"
              secureTextEntry
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange } }) => (
            <Input
              bg="gray.600"
              placeholder="Nova senha"
              secureTextEntry
              onChangeText={onChange}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange } }) => (
            <Input
              bg="gray.600"
              placeholder="Confirme a nova senha"
              secureTextEntry
              onChangeText={onChange}
              errorMessage={errors.confirm_password?.message}
            />
          )}
        />

        <Button
          title="Atualizar"
          mt={4}
          isLoading={isUpdating}
          onPress={handleSubmit(handleProfileUpdate)}
        />
      </ScrollView>
    </VStack>
  )
}

export default Profile
