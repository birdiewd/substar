import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { supabaseClient } from '../lib/client'
import { useDisclosure } from '@chakra-ui/hooks'

import ManageStars from '../components/ManageStars'

const Home = () => {
	const initialRef = useRef()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [starData, setStarData] = useState([])

	const router = useRouter()
	const user = supabaseClient.auth.user()

	const getStars = async () => {
		const { data: stars, error } = await supabaseClient
			.from('stars')
			.select('*')

		if (error) {
			console.log('star fetch error', error)
		} else {
			console.log(stars)
			setStarData(stars)
		}
	}

	useEffect(() => {
		if (!user) {
			router.push('/signin')
		} else {
			getStars()
		}
	}, [user, router])

	return (
		<div>
			<Head>
				<title>subStar</title>
				<meta name="description" content="Give your sub a star." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Navbar onOpen={onOpen} />
				<ul>
					{starData &&
						starData.map((star) => (
							<li key={star.id}>{star.description}</li>
						))}
				</ul>
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
