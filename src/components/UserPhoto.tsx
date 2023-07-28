import { Image, IImageProps } from 'native-base'
import { ReactElement } from 'react'

type UserPhotoProp = IImageProps & {
  size: number
}

function UserPhoto({ size, ...rest }: UserPhotoProp): ReactElement {
  return (
    <Image
      w={size}
      h={size}
      {...rest}
      rounded="full"
      borderWidth={2}
      borderColor="gray.400"
    />
  )
}

export default UserPhoto
