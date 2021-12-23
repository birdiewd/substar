import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AuthSession, AuthChangeEvent } from '@supabase/supabase-js'
import moment from 'moment'

import AppContext from '../AppContext'
import { supabaseClient } from '../lib/client'
import customTheme from '../lib/theme'

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const user = supabaseClient.auth.user()

	const [starData, setStarData] = useState([])
	const [relationshipData, setRelationshipData] = useState([])

	const getStars = async () => {
		console.log({ rel: relationshipData[0]?.owner_id, user: user?.id })
		const { data: stars, error } =
			relationshipData[0]?.owner_id === user?.id
				? await supabaseClient
						.from('stars')
						.select('*')
						.order('created_at', { ascending: false })
				: await supabaseClient
						.from('stars')
						.select('created_at, is_super, id')
						.order('created_at', { ascending: false })
						.lt('created_at', moment().format('YYYY-MM-DD'))

		console.log({ stars })

		if (error) {
			console.log('star fetch error', error)
		} else {
			setStarData(stars)
		}
	}

	const getRelationships = async () => {
		const { data: relationships, error } = await supabaseClient
			.from('relationships')
			.select('*')

		console.log({ relationships })

		if (error) {
			console.log('relationship fetch error', error)
		} else {
			setRelationshipData(relationships)
		}
	}

	const unAuthedPathes = ['/signin', '/recover', '/reset', '/signup']

	useEffect(() => {
		if (!user && !unAuthedPathes.includes(router.pathname)) {
			router.push('/signin')
		} else {
			getRelationships()
		}
	}, [user, router])

	useEffect(() => {
		if (relationshipData.length) {
			getStars()
		}
	}, [relationshipData])

	useEffect(() => {
		const { data: authListener } = supabaseClient.auth.onAuthStateChange(
			(event, session) => {
				handleAuthSession(
					event as AuthChangeEvent,
					session as AuthSession
				)

				if (event === 'PASSWORD_RECOVERY') {
					router.push('/reset')
				}

				if (event === 'SIGNED_OUT') {
					router.push('/signin')
				}

				if (event === 'SIGNED_IN') {
					if (router.pathname !== '/reset') {
						const signedInUser = supabaseClient.auth.user()
						const userId = signedInUser?.id
						supabaseClient
							.from('profiles')
							.upsert({ id: userId })
							.then((_data, error) => {
								if (!error) {
									router.push('/')
								}
							})
					}
				}
			}
		)

		return () => {
			authListener?.unsubscribe()
		}
	}, [router])

	useEffect(() => {
		if (user) {
			console.log({ user })

			if (router.pathname === '/signin') {
				router.push('/')
			}
		}
	}, [router.pathname, user, router])

	const handleAuthSession = async (
		event: AuthChangeEvent,
		session: AuthSession
	) => {
		await fetch('/api/auth', {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			credentials: 'same-origin',
			body: JSON.stringify({ event, session }),
		})
	}

	return (
		<AppContext.Provider
			value={{
				state: {
					relationshipData,
					starData,
					user,
					isOwner: relationshipData[0]?.owner_id === user?.id,
				},
				getStars,
			}}
		>
			<ChakraProvider theme={customTheme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</AppContext.Provider>
	)
}

export default MyApp
