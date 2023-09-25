import { ReactElement, createContext, useEffect, useState } from 'react'
import { api } from '@services/api'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from '@storage/storageUser'

import { UserDTO } from '@dtos/UserDTO'

type SignInProps = {
  email: string
  password: string
}

export type AuthTypeContext = {
  user: UserDTO
  isLoadingUserStorageData: boolean
  signIn: (signInData: SignInProps) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
}

type SessionResult = {
  user: UserDTO
  token: string
  refresh_token: string
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

  const userAndTokenUpdate = async (session: SessionResult) => {
    api.defaults.headers.common.Authorization = `Bearer ${session.token}`

    setUser(session.user)
  }

  const storageUserAndTokenSave = async (session: SessionResult) => {
    try {
      await storageUserSave(session.user)
      await storageAuthTokenSave({
        token: session.token,
        refresh_token: session.refresh_token,
      })
    } catch (error) {
      throw error
    }
  }

  const signIn = async (signInData: SignInProps): Promise<void> => {
    try {
      setIsLoadingUserStorageData(true)

      const { email, password } = signInData
      const { data } = await api.post<SessionResult>('/sessions', {
        email,
        password,
      })

      if (data.user && data.token && data.refresh_token) {
        userAndTokenUpdate(data)
        await storageUserAndTokenSave(data)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)

      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const updateUserProfile = async (userUpdated: UserDTO): Promise<void> => {
    try {
      setUser(userUpdated)

      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const { token, refresh_token } = await storageAuthTokenGet()

      if (token && userLogged) {
        userAndTokenUpdate({ user: userLogged, token, refresh_token })
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

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserStorageData,
        signIn,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
