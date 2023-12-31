import { ReactElement } from 'react'
import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type InputProps = IInputProps & {
  errorMessage?: string | null
}

function Input({
  errorMessage = null,
  isInvalid,
  ...rest
}: InputProps): ReactElement {
  const isInvalidInput = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={isInvalidInput} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        isInvalid={isInvalidInput}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...rest}
      />

      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  )
}

export default Input
