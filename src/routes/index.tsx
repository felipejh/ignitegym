import { ReactElement, useContext } from 'react'
import { useTheme, Box } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { AuthContext } from '@contexts/AuthContext'

import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'

function Routes(): ReactElement {
  const { colors } = useTheme()
  const contextData = useContext(AuthContext)

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}

export default Routes
