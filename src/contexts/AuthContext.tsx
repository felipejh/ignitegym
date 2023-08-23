import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from '@storage/storageUser'
import { ReactElement, createContext, useEffect, useState } from 'react'

type SignInProps = {
  email: string
  password: string
}

export type AuthTypeContext = {
  user: UserDTO
  isLoadingUserStorageData: boolean
  signIn: (signInData: SignInProps) => Promise<void>
  signOut: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactElement
}

export const AuthContext = createContext<AuthTypeContext>({} as AuthTypeContext)

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): ReactElement {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  const signIn = async (signInData: SignInProps): Promise<void> => {
    try {
      const { email, password } = signInData
      const { data } = await api.post('/sessions', { email, password })

      if (data.user) {
        setUser(data.user)
        storageUserSave(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)

      await storageUserRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const loadUserData = async () => {
    try {
      const userLogged = await storageUserGet()

      if (userLogged) {
        setUser(userLogged)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUserStorageData, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
