import { ReactElement } from 'react'
import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'

type ButtonProps = IButtonProps & {
  title: string
  variant?: Extract<IButtonProps['variant'], 'outline' | 'solid'>
}

function Button({ title, variant, ...rest }: ButtonProps): ReactElement {
  return (
    <NativeBaseButton
      w="full"
      h={14}
      bg={variant === 'outline' ? 'transparent' : 'green.700'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="green.500"
      rounded="sm"
      _pressed={{
        bg: variant === 'outline' ? 'gray.500' : 'green.500',
      }}
      {...rest}
    >
      <Text
        color={variant === 'outline' ? 'green.500' : 'white'}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}

export default Button
