import { UserDTO } from '@dtos/UserDTO'
import { ReactElement, createContext, useState } from 'react'

export type AuthTypeContext = {
  user: UserDTO
}

type AuthContextProviderProps = {
  children: ReactElement
}

export const AuthContext = createContext<AuthTypeContext>({} as AuthTypeContext)

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): ReactElement {
  const [user, setUser] = useState<UserDTO>({
    id: '1',
    name: 'Felipe',
    email: 'felipe@gmail.com',
    avatar: 'felipe.png',
  })

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
