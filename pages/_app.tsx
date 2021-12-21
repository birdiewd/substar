import type { AppProps /*, AppContext */ } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { supabaseClient } from '../lib/client'
import { AuthSession, AuthChangeEvent } from '@supabase/supabase-js'
import customTheme from '../lib/theme'

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const user = supabaseClient.auth.user()

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
		<ChakraProvider theme={customTheme}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}

export default MyApp
