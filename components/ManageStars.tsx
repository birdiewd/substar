import {
	Alert,
	AlertIcon,
	Button,
	ButtonGroup,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
	Textarea,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import { supabaseClient } from '../lib/client'

const ManageTodo = ({ isOpen, onClose, initialRef }) => {
	const [description, setDescription] = useState('')
	const [isSuper, setIsSuper] = useState(false)

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const submitHandler = async (event: FormEvent) => {
		event.preventDefault()
		setErrorMessage('')
		if (description.length <= 10) {
			setErrorMessage('Be more descriptive.')
			return
		}
		setIsLoading(true)
		const user = supabaseClient.auth.user()
		const { error } = await supabaseClient
			.from('stars')
			.insert([{ description, isSuper, user_id: user.id }])

		setIsLoading(false)

		if (error) {
			setErrorMessage(error.message)
		} else {
			closeHandler()
		}
	}

	const closeHandler = () => {
		setDescription('')
		setIsSuper(false)

		onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			initialFocusRef={initialRef}
		>
			<ModalOverlay />
			<ModalContent>
				<form onSubmit={submitHandler}>
					<ModalHeader>Add Star</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						{errorMessage && (
							<Alert status="error" borderRadius="lg" mb="6">
								<AlertIcon />
								<Text textAlign="center">{errorMessage}</Text>
							</Alert>
						)}

						<FormControl mt={4} isRequired={true}>
							<FormLabel>Description</FormLabel>
							<Textarea
								placeholder="Add your description here"
								onChange={(event) =>
									setDescription(event.target.value)
								}
								value={description}
							/>
							<FormHelperText>
								Give us a star then.
							</FormHelperText>
						</FormControl>

						<FormControl mt={4}>
							<FormLabel>Is This Super?</FormLabel>
							<Switch
								value={isSuper}
								id="is-super"
								onChange={(event) => setIsSuper(!isSuper)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<ButtonGroup spacing="3">
							<Button
								onClick={closeHandler}
								colorScheme="red"
								type="reset"
								isDisabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								colorScheme="blue"
								type="submit"
								isLoading={isLoading}
							>
								Save
							</Button>
						</ButtonGroup>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	)
}

export default ManageTodo
