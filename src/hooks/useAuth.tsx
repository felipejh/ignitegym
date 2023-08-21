import { useContext } from 'react'
import { AuthContext, AuthTypeContext } from '@contexts/AuthContext'

export function useAuth(): AuthTypeContext {
  const context = useContext(AuthContext)

  return context
}
