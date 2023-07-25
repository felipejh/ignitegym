import { ReactElement } from 'react'
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Button, Input } from '@components'

function SignUp(): ReactElement {
  const navigation = useNavigation()

  const handleGoBack = (): void => navigation.goBack()

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={4} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Input placeholder="Nome" />

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Senha" secureTextEntry />
          <Input placeholder="Confirme a senha" secureTextEntry />
          <Button title="Criar e acessar" />
        </Center>

        <Button mt={12} title="Voltar para o login" variant="outline" onPress={handleGoBack}/>
      </VStack>
    </ScrollView>
  )
}

export default SignUp
