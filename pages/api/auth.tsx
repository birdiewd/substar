import { supabaseClient } from '../../lib/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	supabaseClient.auth.api.setAuthCookie(req, res)
}
