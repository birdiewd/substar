import { Box, Button, ButtonGroup, Flex, Heading } from '@chakra-ui/react'
import NavLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { supabaseClient } from '../lib/client'

import logoPic from '../public/images/subStar_logo.png'

const Navbar = ({ onOpen }) => {
	const router = useRouter()
	const [isLogoutLoading, setIsLogoutLoading] = useState(false)

	const logoutHandler = async () => {
		try {
			setIsLogoutLoading(true)
			await supabaseClient.auth.signOut()
			router.push('/signin')
		} catch (error) {
			router.push('/signin')
		} finally {
			setIsLogoutLoading(false)
		}
	}

	return (
		<Box height="100%" p="5" bg="gray.100">
			<Box maxW="6xl" mx="auto">
				<Flex
					as="nav"
					aria-label="Site navigation"
					align="center"
					justify="space-between"
				>
					<Heading mr="4">
						<Image
							src={logoPic}
							alt="subStar logo"
							width={30}
							height={30}
						/>
						&nbsp; subStar
					</Heading>
					<Box>
						<ButtonGroup spacing="4" ml="6">
							<Button colorScheme="blue" onClick={onOpen}>
								Add Star
							</Button>
							<Button
								colorScheme="red"
								onClick={logoutHandler}
								isLoading={isLogoutLoading}
							>
								Logout
							</Button>
						</ButtonGroup>
					</Box>
				</Flex>
			</Box>
		</Box>
	)
}

export default Navbar
