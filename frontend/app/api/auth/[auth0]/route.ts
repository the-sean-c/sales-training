import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/select-role'
  }),
  callback: handleCallback({
    async afterCallback(req, session) {
      // Add any custom session handling here
      return session
    }
  })
})
