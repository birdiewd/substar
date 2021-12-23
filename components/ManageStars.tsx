import {
	Alert,
	AlertIcon,
	Button,
	ButtonGroup,
	FormControl,
	FormHelperText,
	FormLabel,
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
import { useContext } from 'react'
import moment from 'moment'

import AppContext from '../AppContext'
import { supabaseClient } from '../lib/client'

const ManageTodo = ({ isOpen, onClose, initialRef }) => {
	const {
		state: { user, starData, relationshipData, isOwner },
		getStars,
	} = useContext(AppContext)

	const [description, setDescription] = useState('')
	const [isSuper, setIsSuper] = useState(false)

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const submitHandler = async (event: FormEvent) => {
		event.preventDefault()
		setErrorMessage('')
		if (description.length <= 5) {
			setErrorMessage('Be more descriptive.')
			return
		}
		setIsLoading(true)
		const { error } = await supabaseClient.from('stars').insert([
			{
				description,
				is_super: isSuper,
				owner_id: user?.id,
				sub_id: relationshipData[0].sub_id,
				created_at: moment().format('YYYY-MM-DD'),
			},
		])

		setIsLoading(false)

		if (error) {
			setErrorMessage(error.message)
		} else {
			getStars()
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
