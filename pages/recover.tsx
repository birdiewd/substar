import {
	Alert,
	AlertIcon,
	Box,
	Button,
	chakra,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { supabaseClient } from '../lib/client'

const Recover = () => {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [error, setError] = useState(null)

	const submitHandler = async (event: FormEvent) => {
		event.preventDefault()
		setIsLoading(true)
		setError(null)
		try {
			const { error } =
				await supabaseClient.auth.api.resetPasswordForEmail(email, {
					redirectTo: 'http://substar.local:3000/reset',
				})
			if (error) {
				setError(error.message)
			} else {
				setIsSubmitted(true)
			}
		} catch (error) {
			setError(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const changeHandler = (event: ChangeEvent) => {
		setEmail(event.target.value)
	}

	return (
		<Box minH="100vh" py="12" px={{ base: '4', lg: '8' }} bg="gray.50">
			<Box maxW="md" mx="auto">
				<Heading textAlign="center" m="6">
					Welcome to Todo App
				</Heading>
				{error && (
					<Alert status="error" mb="6">
						<AlertIcon />
						<Text textAlign="center">{error}</Text>
					</Alert>
				)}
				<Box
					py="8"
					px={{ base: '4', md: '10' }}
					shadow="base"
					rounded={{ sm: 'lg' }}
					bg="white"
				>
					{isSubmitted ? (
						<Heading size="md" textAlign="center" color="gray.600">
							A reset email has been sent to you.
						</Heading>
					) : (
						<chakra.form onSubmit={submitHandler}>
							<Stack spacing="6">
								<FormControl id="email">
									<FormLabel>Email address</FormLabel>
									<Input
										name="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={changeHandler}
									/>
								</FormControl>
								<Button
									type="submit"
									colorScheme="blue"
									size="lg"
									fontSize="md"
									isLoading={isLoading}
								>
									Reset Password
								</Button>
							</Stack>
						</chakra.form>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default Recover
