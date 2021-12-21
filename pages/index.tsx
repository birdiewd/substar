import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { supabaseClient } from '../lib/client'
import { useDisclosure } from '@chakra-ui/hooks'

import ManageStars from '../components/ManageStars'

const Home = () => {
	const initialRef = useRef()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const router = useRouter()
	const user = supabaseClient.auth.user()

	useEffect(() => {
		if (!user) {
			router.push('/signin')
		}
	}, [user, router])

	return (
		<div>
			<Head>
				<title>TodoApp</title>
				<meta
					name="description"
					content="Awesome todoapp to store your awesome todos"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Navbar onOpen={onOpen} />
				<ManageStars
					isOpen={isOpen}
					onClose={onClose}
					initialRef={initialRef}
				/>
			</main>
		</div>
	)
}

export default Home
