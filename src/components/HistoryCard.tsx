import { ReactElement } from 'react'
import { HStack, Heading, Text, VStack } from 'native-base'
import { HistoryDTO } from '@dtos/HistoryDTO'

type HistoryCardProp = {
  data: HistoryDTO
}

function HistoryCard({ data }: HistoryCardProp): ReactElement {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr={5} flex={1}>
        <Heading
          color="white"
          fontSize="md"
          textTransform="capitalize"
          fontFamily="heading"
        >
          {data.group}
        </Heading>

        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>
      <Text color="gray.300" fontSize="md">
        08:56
      </Text>
    </HStack>
  )
}

export default HistoryCard
