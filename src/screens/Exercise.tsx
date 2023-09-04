import { ReactElement, useEffect, useState } from 'react'
import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button, Loading } from '@components'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseDTO } from '@dtos/ExerciseDTO'

type RouteParams = {
  params: {
    exerciseId: string
  }
}

function Exercise(): ReactElement {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute<RouteProp<RouteParams>>()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [sendingRegister, isSendingRegister] = useState(false)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)

  const { exerciseId } = route.params

  const fetchExercisesDetails = async (): Promise<void> => {
    try {
      setIsLoading(true)

      const { data } = await api.get(`exercises/${exerciseId}`)

      setExercise(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao buscar os detalhes do exercício.'

      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExerciseHistoryRegister = async (): Promise<void> => {
    try {
      isSendingRegister(true)

      await api.post(`history`, { exercise_id: exerciseId })

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.700',
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao registrar o exercício.'

      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    } finally {
      isSendingRegister(false)
    }
  }

  useEffect(() => {
    fetchExercisesDetails()
  }, [exerciseId])

  const handleGoBack = (): void => navigation.goBack()

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack p={8}>
            <Box rounded="lg" mb={3} overflow="hidden">
              <Image
                w="full"
                h={80}
                mb={3}
                resizeMode="cover"
                alt="Nome do exercício"
                rounded="lg"
                source={{
                  uri: `${api.defaults.baseURL}exercise/demo/${exercise.demo}`,
                }}
              />
            </Box>

            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb={6}
                mt={5}
              >
                <HStack alignItems="center">
                  <SeriesSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.series} séries
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <RepetitionsSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}

export default Exercise
