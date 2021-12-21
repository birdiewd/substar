import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import supabase from '../lib/client'
import Layout from '../components/Layout'

const Unauth: React.FC = () => {
	const { push } = useRouter()

	useEffect(() => {
		supabase.auth.signOut()

		push('/')
	})

	return <Layout title="logout">You are being logged out.</Layout>
}

export default Unauth
