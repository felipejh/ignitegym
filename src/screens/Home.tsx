import { ReactElement, useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { VStack, FlatList, HStack, Heading, Text, useToast } from 'native-base'

import { ExerciseCard, Group, HomeHeader, Loading } from '@components'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseDTO } from '@dtos/ExerciseDTO'

function Home(): ReactElement {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [groups, setGroups] = useState<Array<string>>([])
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const [exercises, setExercises] = useState<Array<ExerciseDTO>>([])

  const fetchGroups = async (): Promise<void> => {
    try {
      const { data } = await api.get('/groups')

      setGroups(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao buscar os grupos musculares.'

      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    }
  }

  const fetchExercisesByGroup = async (): Promise<void> => {
    try {
      setIsLoading(true)

      const { data } = await api.get(`exercises/bygroup/${groupSelected}`)

      setExercises(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Ocorreu um erro ao buscar os exercícios.'

      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected]),
  )

  const handleOpenExerciseDetails = (exerciseId: string): void => {
    navigation.navigate('exercise', { exerciseId })
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 20 }}
          />
        </VStack>
      )}
    </VStack>
  )
}

export default Home
