'use client'

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { AuthForm } from './AuthForm'
import { AuthProfile, BskyAuth, BskyAuthContext } from './BskyAuthContext'
import { useOAuth, UseOAuthOptions } from './oauth/useOauth'


export const AuthProvider = ({
  children,
  ...options
}: {
  children: ReactNode
} & UseOAuthOptions) => {
  const {
    isLoginPopup,
    isInitializing,
    agent: oauthAgent,
    signIn: oauthSignIn,
    signOut: oauthSignOut,
    refresh: oauthRefresh,
  } = useOAuth(options)

  const [profile, setProfile] =  useState<AuthProfile|undefined>(undefined);

  const loadProfile = useCallback(async () => {
    if(!oauthAgent) {
      return;
    }
    const profile = await oauthAgent.com.atproto.repo.getRecord({
      repo: oauthAgent?.did as string,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
    })
    console.log({profile})
    setProfile(profile.data)
  }, [oauthAgent, setProfile])

  useEffect(() => {
    if (oauthAgent) {
      loadProfile()
    }
  },[loadProfile, oauthAgent])


  const value = useMemo<BskyAuth | null>(() => {
    if (oauthAgent) {
      return {
        pdsAgent: oauthAgent,
        signOut: oauthSignOut,
        refresh: oauthRefresh,
        profile: profile,
      }
    }
    return null
  },[
    oauthAgent,
    oauthSignOut,
    oauthRefresh,
    profile
  ])

  if (isLoginPopup) {
    return <div>This window can be closed</div>
  }

  if (isInitializing) {
    return <div>Initializing...</div>
  }

  if (!value) {
    return (
      <AuthForm
        oauthSignIn={oauthSignIn}
      />
    )
  }

  return <BskyAuthContext.Provider value={value}>{children}</BskyAuthContext.Provider>
}
