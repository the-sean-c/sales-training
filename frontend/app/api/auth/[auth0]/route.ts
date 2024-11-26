import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/select-role'
  }),
  logout: handleLogout({
    logoutParams: {
      federated: true, // Logs out from the Auth0 identity provider as well
    },
    returnTo: '/'
  }),
  callback: handleCallback({
    async afterCallback(req, session) {
      // Add any custom session handling here
      return session
    }
  })
})
