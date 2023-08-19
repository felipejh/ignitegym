import { ReactElement, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { VStack, FlatList, HStack, Heading, Text } from 'native-base'

import { ExerciseCard, Group, HomeHeader } from '@components'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

function Home(): ReactElement {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [groups, setGroups] = useState(['Costas', 'Ombro', 'Tríceps', 'bíceps'])
  const [groupSelected, setGroupSelected] = useState('Costas')
  const [exercises, setExercises] = useState([
    'Puxada frontal',
    'Remada curvada',
    'Remada unilateral',
    'Levantamento terra',
  ])

  const handleOpenExerciseDetails = (): void => {
    navigation.navigate('exercise')
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
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 20 }}
        />
      </VStack>
    </VStack>
  )
}

export default Home
